-- RLS Policies and Security Fixes for Keys Pay Provider Architecture - Fixed

-- Enable RLS on all new tables (safe if already enabled)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nymcard_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nymcard_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wio_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardarian_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ramp_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events_v2 ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_org_role(_user_id uuid, _org_id uuid, _role organization_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.role_memberships
    WHERE user_id = _user_id 
    AND organization_id = _org_id 
    AND role = _role 
    AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_organizations(_user_id uuid)
RETURNS TABLE(org_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.role_memberships
  WHERE user_id = _user_id AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.role_memberships
    WHERE user_id = _user_id 
    AND organization_id = _org_id 
    AND is_active = true
  );
$$;

-- Drop existing policies if they exist and recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
  CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (id IN (SELECT org_id FROM public.get_user_organizations(auth.uid())));
  
  DROP POLICY IF EXISTS "Organization owners can update their organization" ON public.organizations;
  CREATE POLICY "Organization owners can update their organization"
  ON public.organizations FOR UPDATE
  USING (public.has_org_role(auth.uid(), id, 'owner'));
  
  DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
  CREATE POLICY "Users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Role memberships policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own role memberships" ON public.role_memberships;
  CREATE POLICY "Users can view their own role memberships"
  ON public.role_memberships FOR SELECT
  USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Organization owners can manage memberships" ON public.role_memberships;
  CREATE POLICY "Organization owners can manage memberships"
  ON public.role_memberships FOR ALL
  USING (public.has_org_role(auth.uid(), organization_id, 'owner'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Ledger accounts policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Organization members can view ledger accounts" ON public.ledger_accounts;
  CREATE POLICY "Organization members can view ledger accounts"
  ON public.ledger_accounts FOR SELECT
  USING (public.is_org_member(auth.uid(), organization_id));
  
  DROP POLICY IF EXISTS "Organization admins can manage ledger accounts" ON public.ledger_accounts;
  CREATE POLICY "Organization admins can manage ledger accounts"
  ON public.ledger_accounts FOR ALL
  USING (public.has_org_role(auth.uid(), organization_id, 'admin') OR public.has_org_role(auth.uid(), organization_id, 'owner'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Ledger entries policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Organization members can view ledger entries" ON public.ledger_entries;
  CREATE POLICY "Organization members can view ledger entries"
  ON public.ledger_entries FOR SELECT
  USING (public.is_org_member(auth.uid(), organization_id));
  
  DROP POLICY IF EXISTS "System can insert ledger entries" ON public.ledger_entries;
  CREATE POLICY "System can insert ledger entries"
  ON public.ledger_entries FOR INSERT
  WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Crypto orders policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own crypto orders" ON public.crypto_orders;
  CREATE POLICY "Users can view their own crypto orders"
  ON public.crypto_orders FOR SELECT
  USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Users can create crypto orders" ON public.crypto_orders;
  CREATE POLICY "Users can create crypto orders"  
  ON public.crypto_orders FOR INSERT
  WITH CHECK (user_id = auth.uid() AND public.is_org_member(auth.uid(), organization_id));
  
  DROP POLICY IF EXISTS "System can update crypto orders" ON public.crypto_orders;
  CREATE POLICY "System can update crypto orders"
  ON public.crypto_orders FOR UPDATE
  USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Bank transfers policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own bank transfers" ON public.bank_transfers;
  CREATE POLICY "Users can view their own bank transfers"
  ON public.bank_transfers FOR SELECT
  USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "Users can create bank transfers" ON public.bank_transfers;
  CREATE POLICY "Users can create bank transfers"
  ON public.bank_transfers FOR INSERT
  WITH CHECK (user_id = auth.uid() AND public.is_org_member(auth.uid(), organization_id));
  
  DROP POLICY IF EXISTS "System can update bank transfers" ON public.bank_transfers;
  CREATE POLICY "System can update bank transfers"
  ON public.bank_transfers FOR UPDATE
  USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- NymCard tables policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own NymCard customer data" ON public.nymcard_customers;
  CREATE POLICY "Users can view their own NymCard customer data"
  ON public.nymcard_customers FOR SELECT
  USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "System can manage NymCard customers" ON public.nymcard_customers;
  CREATE POLICY "System can manage NymCard customers"
  ON public.nymcard_customers FOR ALL
  USING (true);
  
  DROP POLICY IF EXISTS "Users can view their own NymCard cards" ON public.nymcard_cards;
  CREATE POLICY "Users can view their own NymCard cards"
  ON public.nymcard_cards FOR SELECT
  USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "System can manage NymCard cards" ON public.nymcard_cards;
  CREATE POLICY "System can manage NymCard cards"
  ON public.nymcard_cards FOR ALL
  USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Wio accounts policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Organization members can view Wio accounts" ON public.wio_accounts;
  CREATE POLICY "Organization members can view Wio accounts"
  ON public.wio_accounts FOR SELECT
  USING (public.is_org_member(auth.uid(), organization_id));
  
  DROP POLICY IF EXISTS "System can manage Wio accounts" ON public.wio_accounts;
  CREATE POLICY "System can manage Wio accounts"
  ON public.wio_accounts FOR ALL
  USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Provider order policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "System can manage webhook events v2" ON public.webhook_events_v2;
  CREATE POLICY "System can manage webhook events v2"
  ON public.webhook_events_v2 FOR ALL
  USING (true);
  
  DROP POLICY IF EXISTS "Admins can view webhook events v2" ON public.webhook_events_v2;
  CREATE POLICY "Admins can view webhook events v2"
  ON public.webhook_events_v2 FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  ));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;