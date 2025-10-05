-- Fix OTP security settings to meet recommended thresholds
-- Update OTP expiry to 2 minutes (recommended maximum is 5 minutes)
UPDATE public.otp_security_settings
SET 
  otp_expiry_minutes = 2,
  max_attempts = 3,
  block_duration_minutes = 30,
  updated_at = now()
WHERE otp_expiry_minutes > 5 OR otp_expiry_minutes IS NULL;

-- If no settings exist, create safe defaults
INSERT INTO public.otp_security_settings (
  otp_expiry_minutes,
  max_attempts,
  block_duration_minutes,
  created_at,
  updated_at
)
SELECT 2, 3, 30, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.otp_security_settings);

-- Log this security improvement
INSERT INTO public.security_events (
  event_type,
  event_description,
  risk_score,
  metadata
) VALUES (
  'SECURITY_CONFIG_UPDATED',
  'Reduced OTP expiry time to recommended 2 minutes',
  0,
  jsonb_build_object(
    'setting', 'otp_expiry',
    'new_value', 2,
    'reason', 'security_hardening'
  )
);