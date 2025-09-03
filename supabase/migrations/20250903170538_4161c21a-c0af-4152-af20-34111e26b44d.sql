-- Fix security issues identified by linter

-- Enable RLS on the new OTP security settings table
ALTER TABLE public.otp_security_settings ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for OTP security settings (admin-only access)
CREATE POLICY "Only super admins can manage OTP security settings"
ON public.otp_security_settings
FOR ALL
USING (is_super_admin());

-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.check_otp_rate_limit_enhanced(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_record RECORD;
  v_settings RECORD;
  v_result jsonb;
BEGIN
  -- Get security settings
  SELECT * INTO v_settings FROM public.otp_security_settings LIMIT 1;
  
  -- Get or create rate limit record
  SELECT * INTO v_record
  FROM public.otp_rate_limits
  WHERE email = p_email;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.otp_rate_limits (email, attempts)
    VALUES (p_email, 1)
    RETURNING * INTO v_record;
    
    RETURN jsonb_build_object(
      'allowed', true, 
      'remaining_attempts', v_settings.max_attempts - 1,
      'otp_expiry_minutes', v_settings.otp_expiry_minutes
    );
  END IF;
  
  -- Check if currently blocked
  IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false, 
      'blocked_until', v_record.blocked_until,
      'reason', 'rate_limited'
    );
  END IF;
  
  -- Reset attempts if more than 1 hour has passed
  IF v_record.last_attempt < now() - INTERVAL '1 hour' THEN
    UPDATE public.otp_rate_limits
    SET attempts = 1, last_attempt = now(), blocked_until = NULL
    WHERE email = p_email;
    
    RETURN jsonb_build_object(
      'allowed', true, 
      'remaining_attempts', v_settings.max_attempts - 1,
      'otp_expiry_minutes', v_settings.otp_expiry_minutes
    );
  END IF;
  
  -- Increment attempts
  UPDATE public.otp_rate_limits
  SET attempts = attempts + 1, last_attempt = now()
  WHERE email = p_email;
  
  -- Check if should be blocked
  IF v_record.attempts + 1 >= v_settings.max_attempts THEN
    UPDATE public.otp_rate_limits
    SET blocked_until = now() + (v_settings.block_duration_minutes || ' minutes')::INTERVAL
    WHERE email = p_email;
    
    -- Log security event for excessive OTP attempts
    PERFORM public.log_security_event(
      'OTP_RATE_LIMIT_EXCEEDED',
      'Excessive OTP requests from email: ' || p_email,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      70,
      true,
      jsonb_build_object('email', p_email, 'attempts', v_record.attempts + 1)
    );
    
    RETURN jsonb_build_object(
      'allowed', false, 
      'blocked_until', now() + (v_settings.block_duration_minutes || ' minutes')::INTERVAL,
      'reason', 'rate_limited'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', true, 
    'remaining_attempts', v_settings.max_attempts - (v_record.attempts + 1),
    'otp_expiry_minutes', v_settings.otp_expiry_minutes
  );
END;
$function$;