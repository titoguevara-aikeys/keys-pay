-- Create admin settings table for server-side feature flags
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL CHECK (value IN ('on', 'off')),
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create admin audit table for tracking flag changes
CREATE TABLE IF NOT EXISTS public.admin_audit (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on admin tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage admin settings
CREATE POLICY "Only super admins can manage admin settings"
ON public.admin_settings
FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- Only super admins can view admin audit logs
CREATE POLICY "Only super admins can view admin audit"
ON public.admin_audit
FOR SELECT
USING (is_super_admin());

-- System can insert audit records
CREATE POLICY "System can insert admin audit"
ON public.admin_audit
FOR INSERT
WITH CHECK (true);