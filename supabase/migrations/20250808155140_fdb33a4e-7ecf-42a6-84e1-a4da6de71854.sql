-- Critical Security Fixes Migration - Fixed

-- 1. Add missing RLS policies for security-related tables

-- Enable RLS on tables that don't have it (skip if already enabled)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'biometric_credentials' AND rowsecurity = true) THEN
        ALTER TABLE public.biometric_credentials ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'device_trust' AND rowsecurity = true) THEN
        ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'fraud_rules' AND rowsecurity = true) THEN
        ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'access_control_logs' AND rowsecurity = true) THEN
        ALTER TABLE public.access_control_logs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'security_audit_log' AND rowsecurity = true) THEN
        ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'security_violations' AND rowsecurity = true) THEN
        ALTER TABLE public.security_violations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'platform_config' AND rowsecurity = true) THEN
        ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'platform_license' AND rowsecurity = true) THEN
        ALTER TABLE public.platform_license ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own biometric credentials" ON public.biometric_credentials;
DROP POLICY IF EXISTS "Users can manage their own trusted devices" ON public.device_trust;
DROP POLICY IF EXISTS "Only admins can view fraud rules" ON public.fraud_rules;
DROP POLICY IF EXISTS "Only admins can manage fraud rules" ON public.fraud_rules;
DROP POLICY IF EXISTS "Only admins can view access control logs" ON public.access_control_logs;
DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Only admins can view security violations" ON public.security_violations;
DROP POLICY IF EXISTS "Only super admins can manage platform config" ON public.platform_config;
DROP POLICY IF EXISTS "Only super admins can manage platform license" ON public.platform_license;

-- Create RLS policies
CREATE POLICY "Users can manage their own biometric credentials"
ON public.biometric_credentials
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trusted devices"
ON public.device_trust
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can view fraud rules"
ON public.fraud_rules
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can manage fraud rules"
ON public.fraud_rules
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admins can view access control logs"
ON public.access_control_logs
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can view security audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can view security violations"
ON public.security_violations
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only super admins can manage platform config"
ON public.platform_config
FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "Only super admins can manage platform license"
ON public.platform_license
FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- 2. Create secure IP parsing function for edge functions
CREATE OR REPLACE FUNCTION public.parse_client_ip(headers jsonb)
RETURNS inet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    ip_string text;
    parsed_ip inet;
BEGIN
    -- Try X-Forwarded-For header first (most common)
    ip_string := headers->>'x-forwarded-for';
    
    IF ip_string IS NOT NULL THEN
        -- Take the first IP from comma-separated list
        ip_string := split_part(ip_string, ',', 1);
        ip_string := trim(ip_string);
        
        -- Validate IP format
        BEGIN
            parsed_ip := ip_string::inet;
            RETURN parsed_ip;
        EXCEPTION WHEN OTHERS THEN
            -- Continue to next method
        END;
    END IF;
    
    -- Try X-Real-IP header
    ip_string := headers->>'x-real-ip';
    IF ip_string IS NOT NULL THEN
        BEGIN
            parsed_ip := ip_string::inet;
            RETURN parsed_ip;
        EXCEPTION WHEN OTHERS THEN
            -- Continue to next method
        END;
    END IF;
    
    -- Try CF-Connecting-IP (Cloudflare)
    ip_string := headers->>'cf-connecting-ip';
    IF ip_string IS NOT NULL THEN
        BEGIN
            parsed_ip := ip_string::inet;
            RETURN parsed_ip;
        EXCEPTION WHEN OTHERS THEN
            -- Continue to next method
        END;
    END IF;
    
    -- Default fallback
    RETURN '127.0.0.1'::inet;
END;
$$;