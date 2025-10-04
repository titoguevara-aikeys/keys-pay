
-- ============================================
-- SECURITY FIX: Strengthen RLS on users table
-- ============================================

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Super admins can view all users" ON public.users;

-- Create strict policies with explicit authentication requirements

-- 1. Users can ONLY view their own profile (SELECT)
CREATE POLICY "Users can view only their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Users can ONLY update their own profile (UPDATE) 
CREATE POLICY "Users can update only their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Super admins can view all users (but split from ALL to SELECT only)
CREATE POLICY "Super admins can view all user data"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
      AND (expires_at IS NULL OR expires_at > now())
  )
);

-- 4. Only system/service role can INSERT (user creation handled by triggers)
CREATE POLICY "System can create user records"
ON public.users
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. Prevent DELETE operations (soft delete should be used instead)
CREATE POLICY "Prevent user deletion"
ON public.users
FOR DELETE
TO authenticated
USING (false);

-- Force RLS - no exceptions even for table owner
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

-- Add comment explaining the security model
COMMENT ON TABLE public.users IS 'Contains user profile data including emails. RLS enforced: users can only view/edit their own data, admins can view all (read-only), no public access allowed.';

-- Log the security fix
INSERT INTO public.security_events (
  event_type,
  event_description,
  risk_score,
  metadata
) VALUES (
  'SECURITY_FIX_APPLIED',
  'Strengthened RLS policies on users table to prevent unauthorized access to email addresses',
  0,
  jsonb_build_object(
    'table', 'users',
    'fix_type', 'RLS_POLICY_UPDATE',
    'policies_updated', 4,
    'forced_rls', true
  )
);
