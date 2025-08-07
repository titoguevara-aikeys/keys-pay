-- Fix the create_child_account function with better error handling and security
CREATE OR REPLACE FUNCTION public.create_child_account(
  p_parent_id uuid, 
  p_child_email text, 
  p_first_name text, 
  p_last_name text, 
  p_relationship_type text, 
  p_spending_limit numeric DEFAULT NULL::numeric, 
  p_transaction_limit numeric DEFAULT NULL::numeric
)
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
  FROM public.profiles
  WHERE email = p_child_email;
  
  IF v_child_user_id IS NULL THEN
    -- Child doesn't exist, we'll create a placeholder profile
    -- Generate a new UUID for the child
    v_child_user_id := gen_random_uuid();
    
    INSERT INTO public.profiles (
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
      'user'::public.app_role
    );
    
    -- Create a basic account for the child
    INSERT INTO public.accounts (
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
    INSERT INTO public.security_settings (user_id)
    VALUES (v_child_user_id);
  END IF;
  
  -- Create family control relationship
  INSERT INTO public.family_controls (
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