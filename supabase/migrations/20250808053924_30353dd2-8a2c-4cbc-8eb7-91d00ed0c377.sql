-- Step 2: Complete protection system after enum is committed
-- Add owner protection fields to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_protected_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS owner_since TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS platform_signature TEXT;

-- Create all protection tables
CREATE TABLE IF NOT EXISTS public.platform_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    encrypted_value TEXT NOT NULL,
    checksum TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_license (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key TEXT UNIQUE NOT NULL,
    owner_email TEXT NOT NULL,
    domain_whitelist TEXT[] DEFAULT '{}',
    max_users INTEGER DEFAULT 10000,
    features JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    digital_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id),
    domain TEXT,
    evidence JSONB DEFAULT '{}',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.access_control_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address INET,
    success BOOLEAN NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_license ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_control_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;