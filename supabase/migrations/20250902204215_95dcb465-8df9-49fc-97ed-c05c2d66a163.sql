-- Keys Pay Database Schema - Double-Entry Ledger System
-- Create the core ledger system for Keys Pay

-- Ledger Accounts (Chart of Accounts)
CREATE TABLE public.ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL CHECK (owner_type IN ('user', 'organization', 'system')),
  owner_id uuid NOT NULL,
  currency text NOT NULL DEFAULT 'AED',
  account_type text NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  account_code text,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Ledger Entries (Double-entry bookkeeping)
CREATE TABLE public.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.ledger_accounts(id),
  kind text NOT NULL CHECK (kind IN ('debit', 'credit')),
  amount numeric(20,8) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'AED',
  ref_type text, -- 'crypto_order', 'bank_transfer', 'card_transaction', etc.
  ref_id uuid, -- Reference to the related transaction
  description text,
  metadata jsonb DEFAULT '{}',
  entry_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now()
);

-- Bank Transfers (UAE/GCC transfers via Wio)
CREATE TABLE public.bank_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'wio',
  provider_ref text UNIQUE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  currency text NOT NULL DEFAULT 'AED',
  amount numeric(20,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'cancelled')),
  beneficiary_json jsonb NOT NULL, -- Bank details, name, etc.
  purpose_code text, -- UAE regulatory purpose codes
  fees_amount numeric(20,2) DEFAULT 0,
  exchange_rate numeric(10,6),
  expected_completion_date date,
  completed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for optimal performance
CREATE INDEX idx_ledger_accounts_owner ON public.ledger_accounts(owner_type, owner_id);
CREATE INDEX idx_ledger_accounts_currency ON public.ledger_accounts(currency);
CREATE INDEX idx_ledger_entries_account ON public.ledger_entries(account_id);
CREATE INDEX idx_ledger_entries_ref ON public.ledger_entries(ref_type, ref_id);
CREATE INDEX idx_ledger_entries_date ON public.ledger_entries(entry_date);
CREATE INDEX idx_bank_transfers_org ON public.bank_transfers(organization_id);
CREATE INDEX idx_bank_transfers_provider_ref ON public.bank_transfers(provider_ref);
CREATE INDEX idx_bank_transfers_status ON public.bank_transfers(status);

-- Enable RLS on new tables
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ledger_accounts
CREATE POLICY "Users can view their own ledger accounts" ON public.ledger_accounts
  FOR SELECT USING (
    (owner_type = 'user' AND owner_id = auth.uid()) OR
    (owner_type = 'organization' AND owner_id IN (SELECT org_id FROM get_user_organizations(auth.uid())))
  );

CREATE POLICY "Organizations can manage their ledger accounts" ON public.ledger_accounts
  FOR ALL USING (
    owner_type = 'organization' AND 
    has_org_role(auth.uid(), owner_id, 'admin'::organization_role)
  );

CREATE POLICY "System can manage system accounts" ON public.ledger_accounts
  FOR ALL USING (owner_type = 'system' AND is_admin());

-- RLS Policies for ledger_entries
CREATE POLICY "Users can view ledger entries for their accounts" ON public.ledger_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ledger_accounts la 
      WHERE la.id = ledger_entries.account_id 
      AND (
        (la.owner_type = 'user' AND la.owner_id = auth.uid()) OR
        (la.owner_type = 'organization' AND la.owner_id IN (SELECT org_id FROM get_user_organizations(auth.uid())))
      )
    )
  );

CREATE POLICY "System can insert ledger entries" ON public.ledger_entries
  FOR INSERT WITH CHECK (true); -- System operations via service role

-- RLS Policies for bank_transfers
CREATE POLICY "Organizations can view their bank transfers" ON public.bank_transfers
  FOR SELECT USING (
    organization_id IN (SELECT org_id FROM get_user_organizations(auth.uid()))
  );

CREATE POLICY "Organization admins can create bank transfers" ON public.bank_transfers
  FOR INSERT WITH CHECK (
    has_org_role(auth.uid(), organization_id, 'admin'::organization_role)
  );

CREATE POLICY "System can update bank transfers" ON public.bank_transfers
  FOR UPDATE USING (true); -- Webhook updates via service role

-- Add updated_at trigger for bank_transfers
CREATE TRIGGER update_bank_transfers_updated_at
  BEFORE UPDATE ON public.bank_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system ledger accounts
INSERT INTO public.ledger_accounts (owner_type, owner_id, currency, account_type, account_code, name, description) VALUES
  ('system', '00000000-0000-0000-0000-000000000000', 'AED', 'asset', 'CASH_AED', 'Cash - AED', 'System cash account for AED'),
  ('system', '00000000-0000-0000-0000-000000000000', 'USD', 'asset', 'CASH_USD', 'Cash - USD', 'System cash account for USD'),
  ('system', '00000000-0000-0000-0000-000000000000', 'AED', 'liability', 'FEES_PAYABLE', 'Fees Payable', 'Outstanding fees to providers'),
  ('system', '00000000-0000-0000-0000-000000000000', 'AED', 'revenue', 'PROVIDER_FEES', 'Provider Fee Revenue', 'Revenue from provider fees');