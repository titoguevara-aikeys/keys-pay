-- Fix remaining security functions search_path

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_protected_owner()
RETURNS boolean
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

-- Fix role management policy to be more secure
DROP POLICY IF EXISTS "Users can update their own profile (except role)" ON public.profiles;

CREATE POLICY "Users can update their own profile (except role)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    -- Allow role changes only by admins or super admins
    (
        role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    )
);

-- Create role change audit trigger (fixed)
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

-- Drop and recreate trigger if it exists
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.profiles;
CREATE TRIGGER audit_role_changes_trigger
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_role_changes();