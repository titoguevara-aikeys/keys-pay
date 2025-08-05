-- Create notifications system
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'error', 'success', 'transaction', 'security'
  category TEXT NOT NULL DEFAULT 'general', -- 'transaction', 'security', 'family', 'payment', 'system'
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  action_url TEXT
);

-- Create payments system tables
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'card', 'bank_account', 'digital_wallet'
  provider TEXT NOT NULL, -- 'stripe', 'paypal', 'apple_pay', etc.
  external_id TEXT NOT NULL, -- Stripe payment method ID, etc.
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bill pay system
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee_name TEXT NOT NULL,
  payee_account TEXT NOT NULL,
  amount NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  category TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT, -- 'monthly', 'weekly', 'yearly'
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'cancelled'
  account_id UUID REFERENCES public.accounts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheduled transfers
CREATE TABLE public.scheduled_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_account_id UUID NOT NULL REFERENCES public.accounts(id),
  to_account_id UUID REFERENCES public.accounts(id),
  external_recipient TEXT, -- For external transfers
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  frequency TEXT NOT NULL, -- 'once', 'daily', 'weekly', 'monthly', 'yearly'
  next_execution TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create QR payment codes
CREATE TABLE public.qr_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  description TEXT,
  qr_code TEXT NOT NULL, -- Base64 encoded QR code or reference
  expires_at TIMESTAMPTZ,
  is_reusable BOOLEAN DEFAULT FALSE,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create budgets system
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly', -- 'weekly', 'monthly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE,
  alert_threshold NUMERIC(3,2) DEFAULT 0.80, -- Alert at 80% by default
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create spending insights
CREATE TABLE public.spending_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  transaction_count INTEGER NOT NULL,
  avg_transaction NUMERIC(10,2) NOT NULL,
  budget_id UUID REFERENCES public.budgets(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create merchant system
CREATE TABLE public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_phone TEXT,
  business_address TEXT,
  merchant_id TEXT UNIQUE, -- External merchant ID (Stripe, etc.)
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'suspended'
  verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment requests (social features)
CREATE TABLE public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT, -- For requests to non-users
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled', 'expired'
  expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for payment methods
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for bills
CREATE POLICY "Users can manage their own bills" ON public.bills
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for scheduled transfers
CREATE POLICY "Users can manage their own scheduled transfers" ON public.scheduled_transfers
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for QR payments
CREATE POLICY "Users can manage their own QR payments" ON public.qr_payments
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for spending insights
CREATE POLICY "Users can view their own spending insights" ON public.spending_insights
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for merchants
CREATE POLICY "Users can manage their own merchant accounts" ON public.merchants
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for payment requests
CREATE POLICY "Users can view payment requests involving them" ON public.payment_requests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create payment requests" ON public.payment_requests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update payment requests they created or received" ON public.payment_requests
  FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_payment_methods_user_id_default ON public.payment_methods(user_id, is_default);
CREATE INDEX idx_bills_user_id_due_date ON public.bills(user_id, due_date);
CREATE INDEX idx_scheduled_transfers_next_execution ON public.scheduled_transfers(next_execution) WHERE status = 'active';
CREATE INDEX idx_qr_payments_expires_at ON public.qr_payments(expires_at) WHERE status = 'active';
CREATE INDEX idx_budgets_user_id_period ON public.budgets(user_id, start_date, end_date);
CREATE INDEX idx_spending_insights_user_category_period ON public.spending_insights(user_id, category, period_start, period_end);
CREATE INDEX idx_payment_requests_to_user_status ON public.payment_requests(to_user_id, status);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'general',
  p_data JSONB DEFAULT '{}',
  p_action_url TEXT DEFAULT NULL,
  p_expires_hours INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  notification_id UUID;
  expires_at TIMESTAMPTZ;
BEGIN
  IF p_expires_hours IS NOT NULL THEN
    expires_at := now() + (p_expires_hours || ' hours')::INTERVAL;
  END IF;
  
  INSERT INTO public.notifications (
    user_id, title, message, type, category, data, action_url, expires_at
  ) VALUES (
    p_user_id, p_title, p_message, p_type, p_category, p_data, p_action_url, expires_at
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;