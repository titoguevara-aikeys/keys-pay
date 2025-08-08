-- Step 3: Complete protection system with functions, triggers, and data
-- Mark tito.guevara@gmail.com as protected owner with super_admin role
UPDATE public.profiles 
SET 
    role = 'super_admin',
    is_protected_owner = TRUE,
    owner_since = now(),
    platform_signature = encode(digest('AIKEYS_FINANCIAL_PLATFORM_OWNER_' || user_id::text || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
WHERE email = 'tito.guevara@gmail.com';

-- Create security functions with proper search_path
CREATE OR REPLACE FUNCTION public.is_protected_owner()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
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

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
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