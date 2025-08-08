-- Critical Security Fixes Migration

-- 1. Add missing RLS policies for security-related tables

-- Enable RLS on tables that don't have it
ALTER TABLE public.biometric_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_control_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_license ENABLE ROW LEVEL SECURITY;

-- Biometric credentials - users can only manage their own
CREATE POLICY "Users can manage their own biometric credentials"
ON public.biometric_credentials
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Device trust - users can only manage their own trusted devices  
CREATE POLICY "Users can manage their own trusted devices"
ON public.device_trust
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fraud rules - admin only access
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

-- Access control logs - admin read-only access
CREATE POLICY "Only admins can view access control logs"
ON public.access_control_logs
FOR SELECT
TO authenticated
USING (is_admin());

-- Security audit log - admin read-only access
CREATE POLICY "Only admins can view security audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (is_admin());

-- Security violations - admin read-only access
CREATE POLICY "Only admins can view security violations"
ON public.security_violations
FOR SELECT
TO authenticated
USING (is_admin());

-- Platform config - super admin only
CREATE POLICY "Only super admins can manage platform config"
ON public.platform_config
FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- Platform license - super admin only
CREATE POLICY "Only super admins can manage platform license"
ON public.platform_license
FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- 2. Secure role management - prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (except role)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    -- Prevent role changes unless user is admin
    (OLD.role = NEW.role OR is_admin())
);

-- 3. Create role change audit trigger
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER audit_role_changes_trigger
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_role_changes();

-- 4. Harden existing security functions with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
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

-- 5. Create secure IP parsing function for edge functions
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