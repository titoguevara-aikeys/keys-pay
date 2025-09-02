-- Keys Pay (GCC) Provider Architecture Migration - Fixed
-- Replace NIUM + Arab Bank Zurich with Wio + NymCard + Guardarian + Ramp

-- Create enums with proper handling for existing types
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user', 'ops');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.organization_role AS ENUM ('owner', 'admin', 'member', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.ledger_account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.crypto_order_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.transfer_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'individual', -- individual, business
  country_code TEXT NOT NULL DEFAULT 'AE', -- GCC focus
  license_number TEXT,
  tax_id TEXT,
  kyb_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  kyb_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Role memberships (separate from profiles as per best practices)
CREATE TABLE IF NOT EXISTS public.role_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.organization_role NOT NULL DEFAULT 'member',
  app_role public.app_role NOT NULL DEFAULT 'user',
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Double-entry ledger accounts
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type public.ledger_account_type NOT NULL,
  parent_account_id UUID REFERENCES public.ledger_accounts(id),
  currency TEXT NOT NULL DEFAULT 'AED',
  balance DECIMAL(20,8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(organization_id, account_code)
);

-- Double-entry ledger entries
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID NOT NULL, -- Links to external transaction
  account_id UUID REFERENCES public.ledger_accounts(id) NOT NULL,
  debit_amount DECIMAL(20,8) DEFAULT 0,
  credit_amount DECIMAL(20,8) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'AED',
  description TEXT NOT NULL,
  reference TEXT,
  provider TEXT, -- wio, nymcard, guardarian, ramp
  provider_transaction_id TEXT,
  posted_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Crypto orders (for Guardarian + Ramp)
CREATE TABLE IF NOT EXISTS public.crypto_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- guardarian, ramp
  provider_order_id TEXT,
  order_type TEXT NOT NULL, -- buy, sell
  fiat_currency TEXT NOT NULL DEFAULT 'AED',
  crypto_currency TEXT NOT NULL,
  fiat_amount DECIMAL(20,8),
  crypto_amount DECIMAL(20,8),
  exchange_rate DECIMAL(20,8),
  fee_amount DECIMAL(20,8) DEFAULT 0,
  status public.crypto_order_status DEFAULT 'pending',
  checkout_url TEXT,
  webhook_data JSONB DEFAULT '{}',
  settled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bank transfers (Wio integration)
CREATE TABLE IF NOT EXISTS public.bank_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL DEFAULT 'wio',
  provider_transfer_id TEXT,
  transfer_type TEXT NOT NULL, -- domestic, international, internal
  from_account TEXT NOT NULL,
  to_account TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  fee_amount DECIMAL(20,8) DEFAULT 0,
  status public.transfer_status DEFAULT 'pending',
  purpose_code TEXT,
  reference TEXT,
  swift_code TEXT,
  iban TEXT,
  routing_number TEXT,
  webhook_data JSONB DEFAULT '{}',
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Provider-specific tables
CREATE TABLE IF NOT EXISTS public.nymcard_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  nymcard_customer_id TEXT UNIQUE NOT NULL,
  kyc_status TEXT DEFAULT 'pending',
  kyc_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nymcard_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  customer_id UUID REFERENCES public.nymcard_customers(id) ON DELETE CASCADE NOT NULL,
  nymcard_card_id TEXT UNIQUE NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'virtual',
  card_status TEXT DEFAULT 'inactive',
  last_four TEXT,
  expiry_month INTEGER,
  expiry_year INTEGER,
  spending_limits JSONB DEFAULT '{}',
  controls JSONB DEFAULT '{}',
  webhook_data JSONB DEFAULT '{}',
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wio_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  wio_account_id TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  balance DECIMAL(20,8) DEFAULT 0,
  iban TEXT,
  account_number TEXT,
  is_active BOOLEAN DEFAULT true,
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.guardarian_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_order_id UUID REFERENCES public.crypto_orders(id) ON DELETE CASCADE NOT NULL,
  guardarian_order_id TEXT UNIQUE NOT NULL,
  deposit_type TEXT,
  payout_type TEXT,
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ramp_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_order_id UUID REFERENCES public.crypto_orders(id) ON DELETE CASCADE NOT NULL,
  ramp_order_id TEXT UNIQUE NOT NULL,
  widget_config JSONB DEFAULT '{}',
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced webhook events with idempotency
CREATE TABLE IF NOT EXISTS public.webhook_events_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signature TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider, event_id)
);

-- Update existing tables
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'nymcard',
ADD COLUMN IF NOT EXISTS provider_card_id TEXT,
ADD COLUMN IF NOT EXISTS card_controls JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS spending_limits JSONB DEFAULT '{}';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_organization_id UUID REFERENCES public.organizations(id);

-- Create indexes (only if they don't exist)
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_role_memberships_user_org ON public.role_memberships(user_id, organization_id);
  CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries(account_id);
  CREATE INDEX IF NOT EXISTS idx_crypto_orders_user ON public.crypto_orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_bank_transfers_user ON public.bank_transfers(user_id);
  CREATE INDEX IF NOT EXISTS idx_webhook_events_v2_provider_event ON public.webhook_events_v2(provider, event_id);
END $$;