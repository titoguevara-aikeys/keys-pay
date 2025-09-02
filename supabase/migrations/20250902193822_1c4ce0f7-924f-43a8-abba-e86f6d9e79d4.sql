-- Keys Pay (GCC) Provider Architecture Migration
-- Replace NIUM + Arab Bank Zurich with Wio + NymCard + Guardarian + Ramp

-- Create app_role enum if not exists (for role_memberships)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user', 'ops');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create organization_role enum
CREATE TYPE public.organization_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Create ledger_account_type enum
CREATE TYPE public.ledger_account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');

-- Create crypto_order_status enum
CREATE TYPE public.crypto_order_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create transfer_status enum
CREATE TYPE public.transfer_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Organizations table
CREATE TABLE public.organizations (
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
CREATE TABLE public.role_memberships (
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
CREATE TABLE public.ledger_accounts (
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
CREATE TABLE public.ledger_entries (
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
CREATE TABLE public.crypto_orders (
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
CREATE TABLE public.bank_transfers (
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

-- NymCard specific tables
CREATE TABLE public.nymcard_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  nymcard_customer_id TEXT UNIQUE NOT NULL,
  kyc_status TEXT DEFAULT 'pending',
  kyc_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.nymcard_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  customer_id UUID REFERENCES public.nymcard_customers(id) ON DELETE CASCADE NOT NULL,
  nymcard_card_id TEXT UNIQUE NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'virtual', -- virtual, physical
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

CREATE TABLE public.nymcard_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.nymcard_cards(id) ON DELETE CASCADE NOT NULL,
  nymcard_transaction_id TEXT UNIQUE NOT NULL,
  transaction_type TEXT NOT NULL, -- auth, clearing, refund
  amount DECIMAL(20,8) NOT NULL,
  currency TEXT NOT NULL,
  merchant_name TEXT,
  merchant_category TEXT,
  status TEXT NOT NULL,
  webhook_data JSONB DEFAULT '{}',
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wio specific tables
CREATE TABLE public.wio_accounts (
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

CREATE TABLE public.wio_beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  wio_beneficiary_id TEXT UNIQUE NOT NULL,
  beneficiary_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  iban TEXT,
  swift_code TEXT,
  bank_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  currency TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guardarian specific tables
CREATE TABLE public.guardarian_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_order_id UUID REFERENCES public.crypto_orders(id) ON DELETE CASCADE NOT NULL,
  guardarian_order_id TEXT UNIQUE NOT NULL,
  deposit_type TEXT, -- crypto_wallet, bank_account
  payout_type TEXT, -- crypto_wallet, bank_account
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ramp specific tables  
CREATE TABLE public.ramp_orders (
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
  provider TEXT NOT NULL, -- wio, nymcard, guardarian, ramp
  event_id TEXT NOT NULL, -- Provider's event ID for idempotency
  event_type TEXT NOT NULL,
  signature TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider, event_id) -- Ensures idempotency
);

-- Update existing cards table for NymCard integration
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'nymcard',
ADD COLUMN IF NOT EXISTS provider_card_id TEXT,
ADD COLUMN IF NOT EXISTS card_controls JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS spending_limits JSONB DEFAULT '{}';

-- Add organization support to existing profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS primary_organization_id UUID REFERENCES public.organizations(id);

-- Create indexes for performance
CREATE INDEX idx_role_memberships_user_org ON public.role_memberships(user_id, organization_id);
CREATE INDEX idx_role_memberships_active ON public.role_memberships(is_active) WHERE is_active = true;
CREATE INDEX idx_ledger_entries_account ON public.ledger_entries(account_id);
CREATE INDEX idx_ledger_entries_transaction ON public.ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_provider ON public.ledger_entries(provider, provider_transaction_id);
CREATE INDEX idx_crypto_orders_user ON public.crypto_orders(user_id);
CREATE INDEX idx_crypto_orders_status ON public.crypto_orders(status);
CREATE INDEX idx_bank_transfers_user ON public.bank_transfers(user_id);
CREATE INDEX idx_bank_transfers_status ON public.bank_transfers(status);
CREATE INDEX idx_webhook_events_v2_provider_event ON public.webhook_events_v2(provider, event_id);
CREATE INDEX idx_webhook_events_v2_processed ON public.webhook_events_v2(processed) WHERE processed = false;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ledger_accounts_updated_at BEFORE UPDATE ON public.ledger_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crypto_orders_updated_at BEFORE UPDATE ON public.crypto_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_transfers_updated_at BEFORE UPDATE ON public.bank_transfers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_nymcard_customers_updated_at BEFORE UPDATE ON public.nymcard_customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_nymcard_cards_updated_at BEFORE UPDATE ON public.nymcard_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wio_accounts_updated_at BEFORE UPDATE ON public.wio_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wio_beneficiaries_updated_at BEFORE UPDATE ON public.wio_beneficiaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_guardarian_orders_updated_at BEFORE UPDATE ON public.guardarian_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ramp_orders_updated_at BEFORE UPDATE ON public.ramp_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();