-- Create protected owner system with stealth mode (fixed)
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

-- Create RLS helper functions
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

-- Create function for role change auditing
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

-- Insert platform license for domain protection
INSERT INTO public.platform_license (
    license_key,
    domain_whitelist,
    is_active
) VALUES (
    'AIKEYS_ENTERPRISE_' || encode(gen_random_bytes(16), 'hex'),
    NULL, -- Allow all domains initially
    true
);

-- Update the existing tito.guevara@gmail.com profile to be protected owner if it exists
-- If it doesn't exist, it will be created when the user signs up
UPDATE public.profiles 
SET 
    role = 'super_admin'::public.app_role,
    is_admin = true,
    is_protected_owner = true
WHERE email = 'tito.guevara@gmail.com';