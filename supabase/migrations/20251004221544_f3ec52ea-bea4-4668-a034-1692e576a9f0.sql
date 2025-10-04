-- ============================================================================
-- CRITICAL SECURITY FIX: Remove Privilege Escalation Attack Surface
-- ============================================================================
-- This migration removes the ability to modify role/admin status via profiles table
-- All role management MUST go through the user_roles table with proper auditing

-- Step 1: Drop dangerous UPDATE policies that allow role modification
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;

-- Step 2: Create safe UPDATE policy that explicitly BLOCKS role changes
CREATE POLICY "Users can update profile (no role changes)"
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

-- Step 3: Add trigger to block ANY direct role modifications and log attempts
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Block any role/admin/owner changes
  IF (OLD.role IS DISTINCT FROM NEW.role) OR 
     (OLD.is_admin IS DISTINCT FROM NEW.is_admin) OR 
     (OLD.is_protected_owner IS DISTINCT FROM NEW.is_protected_owner) THEN
    
    -- Log security event
    INSERT INTO public.security_events (
      user_id, event_type, event_description, risk_score, blocked, metadata
    ) VALUES (
      auth.uid(),
      'PRIVILEGE_ESCALATION_ATTEMPT',
      'Attempted to modify role/admin status via profiles table',
      100,
      true,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_is_admin', OLD.is_admin,
        'new_is_admin', NEW.is_admin,
        'target_user_id', OLD.user_id
      )
    );
    
    RAISE EXCEPTION 'Role modifications must be done via user_roles table with proper authorization';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply the trigger
DROP TRIGGER IF EXISTS prevent_profile_role_changes ON public.profiles;
CREATE TRIGGER prevent_profile_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Step 4: Add audit logging for user_roles changes
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

-- Step 5: Consolidate duplicate profiles RLS policies
-- Drop all existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create ONE clear set of policies
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE policy already created above with role change prevention