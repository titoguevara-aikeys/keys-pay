-- Add missing metadata column to security_events table
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create missing tables for comprehensive security system
CREATE TABLE IF NOT EXISTS public.device_trust (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  trust_level TEXT DEFAULT 'untrusted' CHECK (trust_level IN ('trusted', 'untrusted', 'blocked')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Create biometric credentials table for WebAuthn
CREATE TABLE IF NOT EXISTS public.biometric_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key BYTEA NOT NULL,
  credential_type TEXT DEFAULT 'platform' CHECK (credential_type IN ('platform', 'cross-platform')),
  name TEXT,
  counter INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fraud detection rules table
CREATE TABLE IF NOT EXISTS public.fraud_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL UNIQUE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('velocity', 'geolocation', 'behavioral', 'transaction')),
  rule_config JSONB NOT NULL,
  risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for device_trust
CREATE POLICY IF NOT EXISTS "Users can manage their own device trust" 
ON public.device_trust 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for biometric_credentials
CREATE POLICY IF NOT EXISTS "Users can manage their own biometric credentials" 
ON public.biometric_credentials 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for fraud_rules (admin only)
CREATE POLICY IF NOT EXISTS "Only admins can manage fraud rules" 
ON public.fraud_rules 
FOR ALL 
USING (public.is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_trust_user_id ON public.device_trust(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trust_fingerprint ON public.device_trust(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_device_trust_trust_level ON public.device_trust(trust_level);

CREATE INDEX IF NOT EXISTS idx_biometric_credentials_user_id ON public.biometric_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_credentials_credential_id ON public.biometric_credentials(credential_id);

-- Add triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_device_trust_updated_at') THEN
        CREATE TRIGGER update_device_trust_updated_at
        BEFORE UPDATE ON public.device_trust
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_biometric_credentials_updated_at') THEN
        CREATE TRIGGER update_biometric_credentials_updated_at
        BEFORE UPDATE ON public.biometric_credentials
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_fraud_rules_updated_at') THEN
        CREATE TRIGGER update_fraud_rules_updated_at
        BEFORE UPDATE ON public.fraud_rules
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

-- Insert default fraud detection rules (only if they don't exist)
INSERT INTO public.fraud_rules (rule_name, rule_type, rule_config, risk_score, is_active) 
SELECT rule_name, rule_type, rule_config::jsonb, risk_score, is_active
FROM (VALUES
  ('high_velocity_transactions', 'velocity', '{"max_amount": 5000, "time_window_hours": 24, "max_transactions": 10}', 70, true),
  ('impossible_travel', 'geolocation', '{"max_velocity_kmh": 500}', 90, true),
  ('suspicious_login_time', 'behavioral', '{"unusual_hours": [0, 1, 2, 3, 4, 5]}', 30, true),
  ('large_transaction', 'transaction', '{"threshold_amount": 10000}', 60, true),
  ('new_device_login', 'behavioral', '{"trust_duration_days": 30}', 40, true)
) AS new_rules(rule_name, rule_type, rule_config, risk_score, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.fraud_rules WHERE fraud_rules.rule_name = new_rules.rule_name
);