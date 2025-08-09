-- Enhanced Family Controls Tables

-- Allowances table for scheduled payments
CREATE TABLE public.allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  child_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL DEFAULT 'weekly', -- weekly, monthly, custom
  next_payment_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  conditions JSONB DEFAULT '{}', -- conditions for earning allowance
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chores and tasks management
CREATE TABLE public.chores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  child_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reward_amount NUMERIC DEFAULT 0,
  due_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- weekly, monthly, etc.
  status TEXT DEFAULT 'assigned', -- assigned, in_progress, completed, approved, rejected
  priority TEXT DEFAULT 'medium', -- low, medium, high
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);

-- Spending categories and limits for children
CREATE TABLE public.child_spending_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  child_id UUID NOT NULL,
  category TEXT NOT NULL,
  daily_limit NUMERIC DEFAULT 0,
  weekly_limit NUMERIC DEFAULT 0,
  monthly_limit NUMERIC DEFAULT 0,
  is_allowed BOOLEAN DEFAULT true,
  time_restrictions JSONB DEFAULT '{}', -- time-based restrictions
  location_restrictions JSONB DEFAULT '{}', -- location-based restrictions
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Financial education modules and progress
CREATE TABLE public.financial_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  module_type TEXT NOT NULL, -- lesson, quiz, challenge
  progress NUMERIC DEFAULT 0, -- 0-100
  score NUMERIC DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Savings goals for children
CREATE TABLE public.child_savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  parent_id UUID NOT NULL,
  goal_name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  target_date DATE,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  reward_description TEXT,
  status TEXT DEFAULT 'active', -- active, completed, paused, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Family activity feed
CREATE TABLE public.family_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_control_id UUID NOT NULL,
  parent_id UUID NOT NULL,
  child_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- transaction, chore_completed, allowance_paid, goal_reached, etc.
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_spending_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for allowances
CREATE POLICY "Parents can manage allowances for their children" ON public.allowances
FOR ALL USING (auth.uid() = parent_id);

-- RLS Policies for chores
CREATE POLICY "Parents can manage chores" ON public.chores
FOR ALL USING (auth.uid() = parent_id);

CREATE POLICY "Children can view and update their chores" ON public.chores
FOR SELECT USING (auth.uid() = child_id);

CREATE POLICY "Children can update chore status" ON public.chores
FOR UPDATE USING (auth.uid() = child_id AND status IN ('in_progress', 'completed'));

-- RLS Policies for spending controls
CREATE POLICY "Parents can manage spending controls" ON public.child_spending_controls
FOR ALL USING (auth.uid() = parent_id);

-- RLS Policies for financial education
CREATE POLICY "Children can manage their education progress" ON public.financial_education
FOR ALL USING (auth.uid() = child_id);

CREATE POLICY "Parents can view child education progress" ON public.financial_education
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.family_controls 
  WHERE parent_id = auth.uid() AND child_id = financial_education.child_id
));

-- RLS Policies for savings goals
CREATE POLICY "Family can manage savings goals" ON public.child_savings_goals
FOR ALL USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- RLS Policies for family activities
CREATE POLICY "Family can view activities" ON public.family_activities
FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Function to process allowance payments
CREATE OR REPLACE FUNCTION public.process_allowance_payment(p_allowance_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_allowance RECORD;
  v_child_account_id UUID;
  v_result JSONB;
BEGIN
  -- Get allowance details
  SELECT * INTO v_allowance
  FROM public.allowances
  WHERE id = p_allowance_id AND is_active = true AND next_payment_date <= CURRENT_DATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Allowance not found or not due');
  END IF;
  
  -- Get child's account
  SELECT id INTO v_child_account_id
  FROM public.accounts
  WHERE user_id = v_allowance.child_id AND account_type = 'checking'
  LIMIT 1;
  
  IF v_child_account_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Child account not found');
  END IF;
  
  -- Create credit transaction
  INSERT INTO public.transactions (
    account_id, transaction_type, amount, description, category, status
  ) VALUES (
    v_child_account_id, 'credit', v_allowance.amount, 
    'Allowance: ' || v_allowance.name, 'allowance', 'completed'
  );
  
  -- Update account balance
  UPDATE public.accounts 
  SET balance = balance + v_allowance.amount, updated_at = now()
  WHERE id = v_child_account_id;
  
  -- Update next payment date
  UPDATE public.allowances
  SET next_payment_date = CASE 
    WHEN frequency = 'weekly' THEN next_payment_date + INTERVAL '7 days'
    WHEN frequency = 'monthly' THEN next_payment_date + INTERVAL '1 month'
    ELSE next_payment_date + INTERVAL '7 days'
  END,
  updated_at = now()
  WHERE id = p_allowance_id;
  
  -- Log family activity
  INSERT INTO public.family_activities (
    family_control_id, parent_id, child_id, activity_type, title, description, amount
  ) SELECT 
    fc.id, v_allowance.parent_id, v_allowance.child_id, 'allowance_paid',
    'Allowance Paid', 'Received allowance: ' || v_allowance.name, v_allowance.amount
  FROM public.family_controls fc 
  WHERE fc.parent_id = v_allowance.parent_id AND fc.child_id = v_allowance.child_id
  LIMIT 1;
  
  RETURN jsonb_build_object('success', true, 'amount', v_allowance.amount);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;