-- Fix function search path security issues
-- These functions need to have search_path set to prevent SQL injection

-- Fix transfer_between_accounts function
CREATE OR REPLACE FUNCTION public.transfer_between_accounts(p_from_account_id uuid, p_to_account_id uuid, p_amount numeric, p_description text DEFAULT 'Internal transfer'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_from_balance NUMERIC;
  v_to_balance NUMERIC;
  v_from_user_id UUID;
  v_to_user_id UUID;
  v_debit_transaction_id UUID;
  v_credit_transaction_id UUID;
  v_result JSONB;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transfer amount must be greater than zero');
  END IF;

  -- Get account details and check if they belong to the same user
  SELECT balance, user_id INTO v_from_balance, v_from_user_id
  FROM accounts
  WHERE id = p_from_account_id AND status = 'active';
  
  SELECT balance, user_id INTO v_to_balance, v_to_user_id
  FROM accounts
  WHERE id = p_to_account_id AND status = 'active';

  -- Check if accounts exist
  IF v_from_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Source account not found or inactive');
  END IF;
  
  IF v_to_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Destination account not found or inactive');
  END IF;

  -- Check if both accounts belong to the same user (for internal transfers)
  IF v_from_user_id != v_to_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot transfer between accounts of different users');
  END IF;

  -- Check if source account has sufficient balance
  IF v_from_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds in source account');
  END IF;

  -- Create debit transaction for source account
  INSERT INTO transactions (
    account_id, transaction_type, amount, description, category, status
  ) VALUES (
    p_from_account_id, 'debit', p_amount, p_description, 'transfer', 'completed'
  ) RETURNING id INTO v_debit_transaction_id;

  -- Create credit transaction for destination account
  INSERT INTO transactions (
    account_id, transaction_type, amount, description, category, status
  ) VALUES (
    p_to_account_id, 'credit', p_amount, p_description, 'transfer', 'completed'
  ) RETURNING id INTO v_credit_transaction_id;

  -- Update source account balance
  UPDATE accounts 
  SET balance = balance - p_amount, updated_at = now()
  WHERE id = p_from_account_id;

  -- Update destination account balance
  UPDATE accounts 
  SET balance = balance + p_amount, updated_at = now()
  WHERE id = p_to_account_id;

  -- Return success result
  v_result := jsonb_build_object(
    'success', true,
    'debit_transaction_id', v_debit_transaction_id,
    'credit_transaction_id', v_credit_transaction_id,
    'amount', p_amount,
    'from_account_id', p_from_account_id,
    'to_account_id', p_to_account_id,
    'message', 'Transfer completed successfully'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information
    v_result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Transfer failed due to unexpected error'
    );
    RETURN v_result;
END;
$function$;

-- Fix create_child_account function
CREATE OR REPLACE FUNCTION public.create_child_account(p_parent_id uuid, p_child_email text, p_first_name text, p_last_name text, p_relationship_type text, p_spending_limit numeric DEFAULT NULL::numeric, p_transaction_limit numeric DEFAULT NULL::numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_child_profile_id uuid;
  v_child_user_id uuid;
  v_account_id uuid;
  v_family_control_id uuid;
  v_result jsonb;
BEGIN
  -- Check if child profile already exists
  SELECT user_id INTO v_child_user_id
  FROM profiles
  WHERE email = p_child_email;
  
  IF v_child_user_id IS NULL THEN
    -- Child doesn't exist, we'll create a placeholder profile
    -- Generate a new UUID for the child
    v_child_user_id := gen_random_uuid();
    
    INSERT INTO profiles (
      user_id,
      email,
      first_name,
      last_name,
      role
    ) VALUES (
      v_child_user_id,
      p_child_email,
      p_first_name,
      p_last_name,
      'user'::app_role
    );
    
    -- Create a basic account for the child
    INSERT INTO accounts (
      user_id,
      account_number,
      account_type,
      balance,
      status
    ) VALUES (
      v_child_user_id,
      'CHILD-' || SUBSTRING(v_child_user_id::text, 1, 8),
      'checking',
      0.00,
      'active'
    ) RETURNING id INTO v_account_id;
    
    -- Create security settings for the child
    INSERT INTO security_settings (user_id)
    VALUES (v_child_user_id);
  END IF;
  
  -- Create family control relationship
  INSERT INTO family_controls (
    parent_id,
    child_id,
    relationship_type,
    spending_limit,
    transaction_limit,
    status
  ) VALUES (
    p_parent_id,
    v_child_user_id,
    p_relationship_type,
    p_spending_limit,
    p_transaction_limit,
    'active'
  ) RETURNING id INTO v_family_control_id;
  
  -- Return result
  v_result := jsonb_build_object(
    'success', true,
    'family_control_id', v_family_control_id,
    'child_user_id', v_child_user_id,
    'account_id', v_account_id,
    'message', 'Child account and family controls created successfully'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information
    v_result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE,
      'message', 'Failed to create child account: ' || SQLERRM
    );
    RETURN v_result;
END;
$function$;

-- Fix create_travel_booking function
CREATE OR REPLACE FUNCTION public.create_travel_booking(p_user_id uuid, p_destination_id uuid, p_account_id uuid, p_booking_type text, p_total_amount numeric, p_departure_date date, p_return_date date DEFAULT NULL::date, p_travelers_count integer DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_booking_id UUID;
  v_transaction_id UUID;
  v_account_balance NUMERIC;
  v_result JSONB;
BEGIN
  -- Check account balance
  SELECT balance INTO v_account_balance
  FROM accounts
  WHERE id = p_account_id AND user_id = p_user_id;
  
  IF v_account_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Account not found');
  END IF;
  
  IF v_account_balance < p_total_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds');
  END IF;
  
  -- Create transaction
  INSERT INTO transactions (
    account_id, transaction_type, amount, description, category
  ) VALUES (
    p_account_id, 'debit', p_total_amount, 
    'Travel booking payment', 'travel'
  ) RETURNING id INTO v_transaction_id;
  
  -- Update account balance
  UPDATE accounts 
  SET balance = balance - p_total_amount,
      updated_at = now()
  WHERE id = p_account_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'message', 'Travel booking completed successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;