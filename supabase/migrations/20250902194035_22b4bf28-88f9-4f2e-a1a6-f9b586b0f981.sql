-- Fix RLS Security Issues for Keys Pay (GCC) Provider Architecture
-- Enable RLS and create policies for all new tables

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nymcard_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nymcard_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nymcard_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wio_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wio_beneficiaries ENABLE ROW LEVEL SECURITY;
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
    SELECT 1
    FROM public.role_memberships
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_access(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.role_memberships
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_app_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.role_memberships
    WHERE user_id = _user_id
      AND app_role = _role
      AND is_active = true
  );
$$;

-- Organizations policies
CREATE POLICY "Users can view organizations they belong to" 
ON public.organizations FOR SELECT 
USING (
  id IN (
    SELECT organization_id 
    FROM public.role_memberships 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Organization owners can update their organization" 
ON public.organizations FOR UPDATE 
USING (has_org_role(auth.uid(), id, 'owner'));

CREATE POLICY "Users can create organizations" 
ON public.organizations FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Role memberships policies
CREATE POLICY "Users can view their role memberships" 
ON public.role_memberships FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Organization owners can manage memberships" 
ON public.role_memberships FOR ALL 
USING (has_org_role(auth.uid(), organization_id, 'owner'));

CREATE POLICY "System can create initial memberships" 
ON public.role_memberships FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Ledger accounts policies
CREATE POLICY "Users can view org ledger accounts" 
ON public.ledger_accounts FOR SELECT 
USING (has_org_access(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage ledger accounts" 
ON public.ledger_accounts FOR ALL 
USING (has_org_role(auth.uid(), organization_id, 'owner') OR has_org_role(auth.uid(), organization_id, 'admin'));

-- Ledger entries policies (read-only for users, system manages)
CREATE POLICY "Users can view org ledger entries" 
ON public.ledger_entries FOR SELECT 
USING (has_org_access(auth.uid(), organization_id));

CREATE POLICY "System can create ledger entries" 
ON public.ledger_entries FOR INSERT 
WITH CHECK (true); -- System-managed, no user constraint

-- Crypto orders policies
CREATE POLICY "Users can manage their crypto orders" 
ON public.crypto_orders FOR ALL 
USING (user_id = auth.uid());

-- Bank transfers policies
CREATE POLICY "Users can manage their bank transfers" 
ON public.bank_transfers FOR ALL 
USING (user_id = auth.uid());

-- NymCard customers policies
CREATE POLICY "Users can manage their NymCard customer records" 
ON public.nymcard_customers FOR ALL 
USING (user_id = auth.uid());

-- NymCard cards policies
CREATE POLICY "Users can manage their NymCard cards" 
ON public.nymcard_cards FOR ALL 
USING (user_id = auth.uid());

-- NymCard transactions policies
CREATE POLICY "Users can view their card transactions" 
ON public.nymcard_transactions FOR SELECT 
USING (
  card_id IN (
    SELECT id FROM public.nymcard_cards WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can create card transactions" 
ON public.nymcard_transactions FOR INSERT 
WITH CHECK (true); -- Webhook-driven, system managed

-- Wio accounts policies
CREATE POLICY "Users can view org Wio accounts" 
ON public.wio_accounts FOR SELECT 
USING (has_org_access(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage Wio accounts" 
ON public.wio_accounts FOR ALL 
USING (has_org_role(auth.uid(), organization_id, 'owner') OR has_org_role(auth.uid(), organization_id, 'admin'));

-- Wio beneficiaries policies
CREATE POLICY "Users can view org Wio beneficiaries" 
ON public.wio_beneficiaries FOR SELECT 
USING (has_org_access(auth.uid(), organization_id));

CREATE POLICY "Organization members can create beneficiaries" 
ON public.wio_beneficiaries FOR INSERT 
WITH CHECK (has_org_access(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage beneficiaries" 
ON public.wio_beneficiaries FOR UPDATE 
USING (has_org_role(auth.uid(), organization_id, 'owner') OR has_org_role(auth.uid(), organization_id, 'admin'));

-- Guardarian orders policies
CREATE POLICY "Users can view their Guardarian orders" 
ON public.guardarian_orders FOR SELECT 
USING (
  crypto_order_id IN (
    SELECT id FROM public.crypto_orders WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can manage Guardarian orders" 
ON public.guardarian_orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update Guardarian orders" 
ON public.guardarian_orders FOR UPDATE 
USING (true);

-- Ramp orders policies
CREATE POLICY "Users can view their Ramp orders" 
ON public.ramp_orders FOR SELECT 
USING (
  crypto_order_id IN (
    SELECT id FROM public.crypto_orders WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can manage Ramp orders" 
ON public.ramp_orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update Ramp orders" 
ON public.ramp_orders FOR UPDATE 
USING (true);

-- Webhook events v2 policies (system-only)
CREATE POLICY "System can manage webhook events" 
ON public.webhook_events_v2 FOR ALL 
USING (true);

CREATE POLICY "Admins can view webhook events" 
ON public.webhook_events_v2 FOR SELECT 
USING (has_app_role(auth.uid(), 'admin') OR has_app_role(auth.uid(), 'super_admin'));

-- Function to create default organization and role for new users
CREATE OR REPLACE FUNCTION public.create_default_organization_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id uuid;
BEGIN
  -- Create default personal organization
  INSERT INTO public.organizations (name, type, country_code)
  VALUES (
    COALESCE(NEW.first_name || '''s Organization', 'Personal Organization'),
    'individual',
    'AE'
  ) RETURNING id INTO org_id;
  
  -- Add user as owner of their organization
  INSERT INTO public.role_memberships (user_id, organization_id, role, app_role)
  VALUES (NEW.user_id, org_id, 'owner', 'user');
  
  -- Update profile with primary organization
  UPDATE public.profiles 
  SET primary_organization_id = org_id 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to create organization when profile is created
CREATE OR REPLACE TRIGGER create_org_for_new_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_organization_for_user();