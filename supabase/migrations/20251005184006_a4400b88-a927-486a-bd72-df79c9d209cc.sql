-- Fix security vulnerability: Consolidate profiles table RLS policies
-- Remove all existing SELECT policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can only see own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile and role info" ON public.profiles;

-- Create a single, clear SELECT policy for profiles
-- Users can only view their own profile
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all profiles for legitimate admin purposes
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- Log this security fix
INSERT INTO public.security_events (
  event_type,
  event_description,
  risk_score,
  metadata
) VALUES (
  'SECURITY_POLICY_UPDATED',
  'Fixed profiles table RLS policies to prevent unauthorized email access',
  0,
  jsonb_build_object(
    'table', 'profiles',
    'action', 'consolidated_rls_policies',
    'vulnerability', 'PUBLIC_USER_DATA'
  )
);