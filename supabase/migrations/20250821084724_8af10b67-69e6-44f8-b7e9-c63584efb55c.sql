-- Create protected owner system with stealth mode
-- Add protected owner flag to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_protected_owner BOOLEAN DEFAULT FALSE;

-- Create security audit log for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create platform license table for domain protection
CREATE TABLE IF NOT EXISTS public.platform_license (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_key TEXT UNIQUE NOT NULL,
    domain_whitelist TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on platform license
ALTER TABLE public.platform_license ENABLE ROW LEVEL SECURITY;

-- Create security violations table
CREATE TABLE IF NOT EXISTS public.security_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    domain TEXT,
    ip_address INET,
    user_agent TEXT,
    blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security violations
ALTER TABLE public.security_violations ENABLE ROW LEVEL SECURITY;

-- Create function to validate platform license
CREATE OR REPLACE FUNCTION public.validate_platform_license()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    license_valid BOOLEAN := FALSE;
    current_domain TEXT;
BEGIN
    SELECT COALESCE(current_setting('request.headers.host', true), 'localhost') INTO current_domain;
    
    SELECT EXISTS (
        SELECT 1 FROM public.platform_license 
        WHERE is_active = TRUE 
        AND (expires_at IS NULL OR expires_at > now())
        AND (domain_whitelist IS NULL OR current_domain = ANY(domain_whitelist))
    ) INTO license_valid;
    
    IF NOT license_valid THEN
        INSERT INTO public.security_violations (violation_type, severity, description, domain)
        VALUES ('unauthorized_access', 'critical', 'Unlicensed platform access detected', current_domain);
    END IF;
    
    RETURN license_valid;
END;
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$;

-- Create function to check if user is protected owner
CREATE OR REPLACE FUNCTION public.is_protected_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() 
        AND is_protected_owner = TRUE 
        AND role = 'super_admin'
    );
END;
$$;

-- Create function to log sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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
$$;

-- Create function to protect owner account
CREATE OR REPLACE FUNCTION public.protect_owner_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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
$$;

-- Create trigger to protect owner account
DROP TRIGGER IF EXISTS protect_owner_trigger ON public.profiles;
CREATE TRIGGER protect_owner_trigger
    BEFORE UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_owner_account();

-- Create trigger for role changes audit
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Log role changes in security audit log
    IF OLD.role != NEW.role THEN
        INSERT INTO public.security_audit_log (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            auth.uid(),
            'ROLE_CHANGE',
            'profiles',
            NEW.user_id,
            jsonb_build_object('old_role', OLD.role),
            jsonb_build_object('new_role', NEW.role)
        );
        
        -- Log as security event
        INSERT INTO public.security_events (
            user_id, event_type, event_description, risk_score
        ) VALUES (
            NEW.user_id,
            'ROLE_CHANGED',
            'User role changed from ' || OLD.role || ' to ' || NEW.role,
            CASE 
                WHEN NEW.role IN ('admin', 'super_admin') THEN 80
                ELSE 40
            END
        );
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.profiles;
CREATE TRIGGER audit_role_changes_trigger
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();

-- RLS Policies for security audit log
CREATE POLICY "Only super admins can view audit log" ON public.security_audit_log
    FOR SELECT USING (is_super_admin());

CREATE POLICY "System can insert audit log" ON public.security_audit_log
    FOR INSERT WITH CHECK (true);

-- RLS Policies for platform license
CREATE POLICY "Only protected owners can manage license" ON public.platform_license
    FOR ALL USING (is_protected_owner());

-- RLS Policies for security violations
CREATE POLICY "Only super admins can view violations" ON public.security_violations
    FOR SELECT USING (is_super_admin());

CREATE POLICY "System can insert violations" ON public.security_violations
    FOR INSERT WITH CHECK (true);

-- Insert the protected owner account
INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    role,
    is_admin,
    is_protected_owner
) VALUES (
    gen_random_uuid(), -- This will be replaced when the actual user signs up
    'tito.guevara@gmail.com',
    'Tito',
    'Guevara',
    'super_admin'::public.app_role,
    true,
    true
) ON CONFLICT (email) DO UPDATE SET
    role = 'super_admin'::public.app_role,
    is_admin = true,
    is_protected_owner = true;

-- Insert platform license
INSERT INTO public.platform_license (
    license_key,
    domain_whitelist,
    is_active
) VALUES (
    'AIKEYS_ENTERPRISE_' || encode(gen_random_bytes(16), 'hex'),
    NULL, -- Allow all domains initially
    true
) ON CONFLICT DO NOTHING;