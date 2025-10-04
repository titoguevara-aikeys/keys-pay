-- Critical Security Fix: Implement Proper Role-Based Access Control (Fixed)
-- This migration creates a secure user_roles table separate from profiles

-- First, clean up orphaned profile records that don't have corresponding auth.users
DELETE FROM public.profiles
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    granted_by uuid REFERENCES auth.users(id),
    granted_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_app_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = _role
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Function to check if user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
      AND role IN ('admin', 'super_admin', 'moderator')
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id 
    AND (expires_at IS NULL OR expires_at > now())
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'moderator' THEN 3
      WHEN 'user' THEN 4
    END
  LIMIT 1;
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only super admins can grant roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_app_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only super admins can revoke roles"
  ON public.user_roles FOR DELETE
  USING (public.has_app_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only super admins can modify roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_app_role(auth.uid(), 'super_admin'));

-- Migrate existing role data from profiles table (only valid user_ids)
INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT p.user_id, p.role, p.created_at
FROM public.profiles p
INNER JOIN auth.users u ON p.user_id = u.id
WHERE p.role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Grant super_admin to protected owner account (only if user exists)
INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT p.user_id, 'super_admin'::app_role, now()
FROM public.profiles p
INNER JOIN auth.users u ON p.user_id = u.id
WHERE p.is_protected_owner = true
ON CONFLICT (user_id, role) DO NOTHING;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Log security event for migration
INSERT INTO public.security_events (
  event_type, 
  event_description, 
  metadata
) VALUES (
  'SECURITY_HARDENING',
  'Implemented secure role-based access control with separate user_roles table',
  jsonb_build_object(
    'migration', 'user_roles_rbac',
    'timestamp', now()
  )
);