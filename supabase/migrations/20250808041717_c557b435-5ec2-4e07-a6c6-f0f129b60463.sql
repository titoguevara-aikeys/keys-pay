-- Comprehensive Platform Protection System
-- 1. Extend app_role enum if it exists, create if not
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        -- Add super_admin if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'app_role' AND e.enumlabel = 'super_admin') THEN
            ALTER TYPE public.app_role ADD VALUE 'super_admin';
        END IF;
    ELSE
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'super_admin');
    END IF;
END $$;

-- 2. Add owner protection fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_protected_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS owner_since TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS platform_signature TEXT;

-- 3. Create platform configuration table (encrypted)
CREATE TABLE IF NOT EXISTS public.platform_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    encrypted_value TEXT NOT NULL,
    checksum TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create platform licensing table
CREATE TABLE IF NOT EXISTS public.platform_license (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key TEXT UNIQUE NOT NULL,
    owner_email TEXT NOT NULL,
    domain_whitelist TEXT[] DEFAULT '{}',
    max_users INTEGER DEFAULT 10000,
    features JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    digital_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create security violations tracking
CREATE TABLE IF NOT EXISTS public.security_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id),
    domain TEXT,
    evidence JSONB DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create access control logs
CREATE TABLE IF NOT EXISTS public.access_control_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address INET,
    success BOOLEAN NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create security audit log
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all security tables
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_license ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_control_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- 8. Mark tito.guevara@gmail.com as protected owner
UPDATE public.profiles 
SET 
    role = 'super_admin',
    is_protected_owner = TRUE,
    owner_since = now(),
    platform_signature = encode(digest('AIKEYS_FINANCIAL_PLATFORM_OWNER_' || user_id::text || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
WHERE email = 'tito.guevara@gmail.com';

-- 9. Create security functions
CREATE OR REPLACE FUNCTION public.is_protected_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND is_protected_owner = TRUE 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.validate_platform_license()
RETURNS BOOLEAN AS $$
DECLARE
    license_valid BOOLEAN := FALSE;
    current_domain TEXT;
BEGIN
    -- Get current domain from request headers (simplified)
    SELECT COALESCE(current_setting('request.headers.host', true), 'localhost') INTO current_domain;
    
    -- Check if license exists and is valid
    SELECT EXISTS (
        SELECT 1 FROM public.platform_license 
        WHERE is_active = TRUE 
        AND (expires_at IS NULL OR expires_at > now())
        AND (domain_whitelist IS NULL OR current_domain = ANY(domain_whitelist))
    ) INTO license_valid;
    
    -- Log violation if invalid
    IF NOT license_valid THEN
        INSERT INTO public.security_violations (violation_type, severity, description, domain)
        VALUES ('unauthorized_access', 'critical', 'Unlicensed platform access detected', current_domain);
    END IF;
    
    RETURN license_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
    -- Log all sensitive operations
    INSERT INTO public.security_audit_log (
        user_id, action, table_name, record_id, old_values, new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create protection trigger
CREATE OR REPLACE FUNCTION public.protect_owner_account()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent deletion or role change of protected owner
    IF OLD.is_protected_owner = TRUE THEN
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Cannot delete protected owner account';
        END IF;
        
        IF NEW.role != 'super_admin' OR NEW.is_protected_owner != TRUE THEN
            RAISE EXCEPTION 'Cannot modify protected owner privileges';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS protect_owner_trigger ON public.profiles;
CREATE TRIGGER protect_owner_trigger
    BEFORE UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_owner_account();

DROP TRIGGER IF EXISTS audit_profiles_trigger ON public.profiles;
CREATE TRIGGER audit_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

-- 11. Insert master platform license
INSERT INTO public.platform_license (
    license_key,
    owner_email,
    domain_whitelist,
    max_users,
    features,
    digital_signature
) VALUES (
    'AIKEYS_MASTER_LICENSE_' || encode(gen_random_bytes(16), 'hex'),
    'tito.guevara@gmail.com',
    ARRAY['aikeys.com', 'www.aikeys.com', 'app.aikeys.com'],
    100000,
    '{"unlimited_users": true, "white_label": true, "api_access": true, "premium_support": true}',
    encode(digest('AIKEYS_PLATFORM_MASTER_SIGNATURE_' || extract(epoch from now())::text, 'sha256'), 'hex')
) ON CONFLICT (license_key) DO NOTHING;

-- 12. Insert encrypted platform configuration
INSERT INTO public.platform_config (config_key, encrypted_value, checksum) VALUES
('OWNER_EMAIL', encode(digest('tito.guevara@gmail.com', 'sha256'), 'hex'), encode(digest('OWNER_CHECKSUM', 'sha256'), 'hex')),
('PLATFORM_NAME', encode(digest('AIKEYS Financial Platform', 'sha256'), 'hex'), encode(digest('NAME_CHECKSUM', 'sha256'), 'hex')),
('COPYRIGHT_YEAR', encode(digest('2025', 'sha256'), 'hex'), encode(digest('YEAR_CHECKSUM', 'sha256'), 'hex'))
ON CONFLICT (config_key) DO NOTHING;

-- 13. RLS Policies
-- Platform config - super admin only
CREATE POLICY "Super admin access only" ON public.platform_config
    FOR ALL USING (public.is_super_admin());

-- Platform license - super admin only
CREATE POLICY "License management" ON public.platform_license
    FOR ALL USING (public.is_super_admin());

-- Security violations - admin+ access
CREATE POLICY "Security violations access" ON public.security_violations
    FOR ALL USING (public.is_admin() OR public.is_super_admin());

-- Access logs - admin+ access
CREATE POLICY "Access logs view" ON public.access_control_logs
    FOR SELECT USING (public.is_admin() OR public.is_super_admin());

-- Audit logs - super admin only
CREATE POLICY "Audit logs super admin" ON public.security_audit_log
    FOR ALL USING (public.is_super_admin());