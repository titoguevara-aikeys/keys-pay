-- Add a function to handle creating child accounts when adding family members
CREATE OR REPLACE FUNCTION public.create_child_account(
  p_parent_id uuid,
  p_child_email text,
  p_first_name text,
  p_last_name text,
  p_relationship_type text,
  p_spending_limit numeric DEFAULT NULL,
  p_transaction_limit numeric DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_child_profile_id uuid;
  v_child_user_id uuid;
  v_account_id uuid;
  v_family_control_id uuid;
  v_result jsonb;
BEGIN
  -- Check if child profile already exists
  SELECT user_id INTO v_child_user_id
  FROM public.profiles
  WHERE email = p_child_email;
  
  IF v_child_user_id IS NULL THEN
    -- Child doesn't exist, we'll create a placeholder profile
    -- In a real implementation, this would send an invitation
    INSERT INTO public.profiles (
      user_id,
      email,
      first_name,
      last_name
    ) VALUES (
      gen_random_uuid(),
      p_child_email,
      p_first_name,
      p_last_name
    ) RETURNING user_id INTO v_child_user_id;
    
    -- Create a basic account for the child
    INSERT INTO public.accounts (
      user_id,
      account_number,
      account_type,
      balance
    ) VALUES (
      v_child_user_id,
      'CHILD-' || SUBSTRING(v_child_user_id::text, 1, 8),
      'checking',
      0.00
    ) RETURNING id INTO v_account_id;
    
    -- Create security settings for the child
    INSERT INTO public.security_settings (user_id)
    VALUES (v_child_user_id);
  END IF;
  
  -- Create family control relationship
  INSERT INTO public.family_controls (
    parent_id,
    child_id,
    relationship_type,
    spending_limit,
    transaction_limit
  ) VALUES (
    p_parent_id,
    v_child_user_id,
    p_relationship_type,
    p_spending_limit,
    p_transaction_limit
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
      'message', 'Failed to create child account'
    );
    RETURN v_result;
END;
$$;