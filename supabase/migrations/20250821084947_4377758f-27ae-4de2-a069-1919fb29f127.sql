-- Create protected owner system with stealth mode (Fixed for existing constraints)
-- Add protected owner flag to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_protected_owner BOOLEAN DEFAULT FALSE;

-- Drop existing platform_license table if it exists to avoid constraint conflicts
DROP TABLE IF EXISTS public.platform_license CASCADE;

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

-- Create platform license table for domain protection (Clean version)
CREATE TABLE public.platform_license (
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

-- Update the protected owner's profile to use tito.guevara@gmail.com
UPDATE public.profiles 
SET 
    email = 'tito.guevara@gmail.com',
    first_name = 'Tito',
    last_name = 'Guevara',
    role = 'super_admin'::public.app_role,
    is_admin = true,
    is_protected_owner = true
WHERE email = 'tito.guevara@gmail.com' OR first_name = 'Tito';

-- If no existing profile, insert new one
INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    role,
    is_admin,
    is_protected_owner
) 
SELECT 
    gen_random_uuid(),
    'tito.guevara@gmail.com',
    'Tito',
    'Guevara',
    'super_admin'::public.app_role,
    true,
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = 'tito.guevara@gmail.com'
);

-- Insert platform license
INSERT INTO public.platform_license (
    license_key,
    domain_whitelist,
    is_active
) VALUES (
    'AIKEYS_ENTERPRISE_' || encode(gen_random_bytes(16), 'hex'),
    NULL,
    true
);

-- RLS Policies for security audit log
DROP POLICY IF EXISTS "Only super admins can view audit log" ON public.security_audit_log;
CREATE POLICY "Only super admins can view audit log" ON public.security_audit_log
    FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "System can insert audit log" ON public.security_audit_log;
CREATE POLICY "System can insert audit log" ON public.security_audit_log
    FOR INSERT WITH CHECK (true);

-- RLS Policies for platform license
DROP POLICY IF EXISTS "Only protected owners can manage license" ON public.platform_license;
CREATE POLICY "Only protected owners can manage license" ON public.platform_license
    FOR ALL USING (is_protected_owner());

-- RLS Policies for security violations
DROP POLICY IF EXISTS "Only super admins can view violations" ON public.security_violations;
CREATE POLICY "Only super admins can view violations" ON public.security_violations
    FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "System can insert violations" ON public.security_violations;
CREATE POLICY "System can insert violations" ON public.security_violations
    FOR INSERT WITH CHECK (true);