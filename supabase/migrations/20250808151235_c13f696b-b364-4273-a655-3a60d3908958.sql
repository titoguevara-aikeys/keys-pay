-- Add missing metadata column to security_events table
ALTER TABLE public.security_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create missing tables for comprehensive security system (with proper conditional creation)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'device_trust') THEN
        CREATE TABLE public.device_trust (
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
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'biometric_credentials') THEN
        CREATE TABLE public.biometric_credentials (
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
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fraud_rules') THEN
        CREATE TABLE public.fraud_rules (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          rule_name TEXT NOT NULL UNIQUE,
          rule_type TEXT NOT NULL CHECK (rule_type IN ('velocity', 'geolocation', 'behavioral', 'transaction')),
          rule_config JSONB NOT NULL,
          risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
    END IF;
END
$$;