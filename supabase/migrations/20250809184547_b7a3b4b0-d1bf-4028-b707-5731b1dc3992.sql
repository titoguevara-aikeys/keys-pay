-- Fix email verification for beta testing
-- This removes the dependency on external webhooks that are causing issues

-- Update auth configuration to disable email confirmation for beta
-- This is done through the dashboard, but we can set up proper email handling

-- Create a simple email notification system for beta
CREATE OR REPLACE FUNCTION handle_user_signup_beta()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log successful signup for beta testing
  INSERT INTO public.security_events (
    user_id, event_type, event_description, metadata
  ) VALUES (
    NEW.id, 
    'USER_SIGNUP_BETA', 
    'User successfully signed up during beta testing',
    jsonb_build_object('email', NEW.email, 'beta_testing', true)
  );
  
  -- Send welcome notification instead of email verification
  INSERT INTO public.notifications (
    user_id, title, message, type, category
  ) VALUES (
    NEW.id,
    'Welcome to AIKEYS Financial Platform!',
    'Your account has been created successfully. Welcome to the beta!',
    'success',
    'onboarding'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for beta signup handling
DROP TRIGGER IF EXISTS on_auth_user_created_beta ON auth.users;
CREATE TRIGGER on_auth_user_created_beta
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_user_signup_beta();