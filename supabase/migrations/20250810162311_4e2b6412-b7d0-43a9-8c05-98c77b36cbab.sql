-- Admin Settings & Audit Tables for Server-Controlled Feature Flags
-- © 2025 AIKEYS Financial Technologies. All Rights Reserved.

-- Admin key-value flags (server-controlled feature flags)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL CHECK (value IN ('on','off')),
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit log for admin flag changes
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  actor UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add is_admin column to existing profiles table for RBAC
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Enable RLS on admin tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_settings (reads allowed, writes via service role)
CREATE POLICY "Anyone can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- RLS Policies for admin_audit (only admins can read audit logs)
CREATE POLICY "Admins can read audit logs" 
ON public.admin_audit 
FOR SELECT 
USING (
  EXISTS(
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.is_admin = true
  )
);

-- Insert default beta_monitoring flag
INSERT INTO public.admin_settings (key, value) 
VALUES ('beta_monitoring', 'off') 
ON CONFLICT (key) DO NOTHING;

-- Add updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();