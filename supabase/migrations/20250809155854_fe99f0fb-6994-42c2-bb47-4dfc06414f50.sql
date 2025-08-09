-- Fix search path security issue for the allowance payment function
CREATE OR REPLACE FUNCTION public.process_allowance_payment(p_allowance_id UUID)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO ''
AS $$
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
$$;