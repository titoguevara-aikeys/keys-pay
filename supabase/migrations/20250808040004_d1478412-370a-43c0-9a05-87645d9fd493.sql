-- Create enhanced role system with super admin protection
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user');

-- Add protected owner field to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_protected_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS owner_since TIMESTAMPTZ DEFAULT now();

-- Mark tito.guevara@gmail.com as the protected owner
UPDATE public.profiles 
SET 
  role = 'super_admin'::public.app_role,
  is_protected_owner = TRUE,
  owner_since = now()
WHERE email = 'tito.guevara@gmail.com';

-- Create function to check if user is the protected owner
CREATE OR REPLACE FUNCTION public.is_protected_owner(user_email text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE (user_email IS NULL AND user_id = auth.uid()) 
       OR (user_email IS NOT NULL AND email = user_email)
       AND is_protected_owner = TRUE
       AND role = 'super_admin'
  );
$$;

-- Create function to check if user has super admin role
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Create function to prevent owner deletion/modification
CREATE OR REPLACE FUNCTION public.protect_owner_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent deletion of protected owner
  IF TG_OP = 'DELETE' THEN
    IF OLD.is_protected_owner = TRUE THEN
      RAISE EXCEPTION 'Cannot delete protected owner account. This action requires legal authorization.';
    END IF;
    RETURN OLD;
  END IF;
  
  -- Prevent modification of protected owner status
  IF TG_OP = 'UPDATE' THEN
    -- Only super admin can modify other users, but cannot modify owner protection
    IF OLD.is_protected_owner = TRUE THEN
      -- Prevent removing owner protection
      IF NEW.is_protected_owner = FALSE THEN
        RAISE EXCEPTION 'Cannot remove owner protection. This action requires legal authorization.';
      END IF;
      
      -- Prevent role downgrade from super_admin
      IF NEW.role != 'super_admin' THEN
        RAISE EXCEPTION 'Cannot change protected owner role. This action requires legal authorization.';
      END IF;
      
      -- Prevent email change for protected owner
      IF NEW.email != OLD.email THEN
        RAISE EXCEPTION 'Cannot change protected owner email. This action requires legal authorization.';
      END IF;
    END IF;
    
    -- Prevent anyone except super admin from granting owner protection
    IF OLD.is_protected_owner = FALSE AND NEW.is_protected_owner = TRUE THEN
      IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Only super admin can grant owner protection.';
      END IF;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger to protect owner account
DROP TRIGGER IF EXISTS protect_owner_trigger ON public.profiles;
CREATE TRIGGER protect_owner_trigger
  BEFORE UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_owner_account();

-- Create audit log for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  target_user_id UUID,
  target_email TEXT,
  performed_by UUID REFERENCES auth.users(id),
  performed_by_email TEXT,
  action_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (public.is_super_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

-- Create function to log sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation(
  p_action_type TEXT,
  p_target_user_id UUID DEFAULT NULL,
  p_target_email TEXT DEFAULT NULL,
  p_action_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_performer_email TEXT;
BEGIN
  -- Get performer email
  SELECT email INTO v_performer_email FROM public.profiles WHERE user_id = auth.uid();
  
  INSERT INTO public.security_audit_log (
    action_type,
    target_user_id,
    target_email,
    performed_by,
    performed_by_email,
    action_details
  ) VALUES (
    p_action_type,
    p_target_user_id,
    p_target_email,
    auth.uid(),
    v_performer_email,
    p_action_details
  );
END;
$$;

-- Update profiles RLS policies to respect super admin hierarchy
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
CREATE POLICY "Super admins can manage all profiles"
ON public.profiles
FOR ALL
USING (
  public.is_super_admin() 
  AND (
    -- Super admin can manage non-protected accounts
    (SELECT is_protected_owner FROM public.profiles WHERE user_id = profiles.user_id) = FALSE
    -- Or they are managing their own account
    OR auth.uid() = profiles.user_id
  )
);

-- Create emergency recovery function (only for legal use)
CREATE OR REPLACE FUNCTION public.emergency_owner_recovery(
  p_new_email TEXT,
  p_legal_authorization_code TEXT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function should only be used with proper legal authorization
  -- The authorization code should be changed before production
  IF p_legal_authorization_code != 'LEGAL_AUTH_2024_CHANGE_THIS_CODE' THEN
    RAISE EXCEPTION 'Invalid legal authorization code.';
  END IF;
  
  -- Log the emergency recovery attempt
  PERFORM public.log_sensitive_operation(
    'EMERGENCY_OWNER_RECOVERY',
    NULL,
    p_new_email,
    jsonb_build_object('previous_email', 'tito.guevara@gmail.com', 'reason', 'Emergency legal recovery')
  );
  
  -- Update owner email (only if legally authorized)
  UPDATE public.profiles 
  SET email = p_new_email
  WHERE is_protected_owner = TRUE;
  
  RETURN TRUE;
END;
$$;