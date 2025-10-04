-- ============================================================================
-- CRITICAL SECURITY FIX: Remove Privilege Escalation Attack Surface
-- ============================================================================

-- Step 1: Drop ALL existing policies on profiles to start clean
DROP POLICY IF EXISTS "Users can update profile (no role changes)" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Step 2: Create ONE clear set of safe policies
CREATE POLICY "profiles_select_policy"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_policy"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid() 
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
  AND is_admin = (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid())
  AND is_protected_owner = (SELECT is_protected_owner FROM public.profiles WHERE user_id = auth.uid())
);

-- Step 3: Add trigger to block direct role modifications
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role) OR 
     (OLD.is_admin IS DISTINCT FROM NEW.is_admin) OR 
     (OLD.is_protected_owner IS DISTINCT FROM NEW.is_protected_owner) THEN
    
    INSERT INTO public.security_events (
      user_id, event_type, event_description, risk_score, blocked, metadata
    ) VALUES (
      auth.uid(),
      'PRIVILEGE_ESCALATION_ATTEMPT',
      'Blocked attempt to modify role/admin via profiles table',
      100,
      true,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'target_user_id', OLD.user_id
      )
    );
    
    RAISE EXCEPTION 'Role changes must use user_roles table';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_changes ON public.profiles;
CREATE TRIGGER prevent_profile_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Step 4: Add audit logging for user_roles
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.security_events (
      user_id, event_type, event_description, risk_score, metadata
    ) VALUES (
      NEW.user_id,
      'ROLE_ASSIGNED',
      'Role assigned: ' || NEW.role::text,
      CASE WHEN NEW.role IN ('admin', 'super_admin') THEN 80 ELSE 30 END,
      jsonb_build_object('role', NEW.role, 'assigned_by', auth.uid())
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.security_events (
      user_id, event_type, event_description, risk_score, metadata
    ) VALUES (
      OLD.user_id,
      'ROLE_REVOKED',
      'Role revoked: ' || OLD.role::text,
      50,
      jsonb_build_object('role', OLD.role, 'revoked_by', auth.uid())
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS audit_user_role_changes ON public.user_roles;
CREATE TRIGGER audit_user_role_changes
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();