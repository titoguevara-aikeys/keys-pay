-- Update AIKEYS Financial Platform license to unlimited users
-- Remove the 100,000 user limit for true unlimited capacity

UPDATE public.platform_license 
SET 
    max_users = NULL, -- NULL means unlimited users
    features = features || jsonb_build_object('unlimited_users', true, 'enterprise_scale', true),
    digital_signature = encode(digest('AIKEYS_FINANCIAL_PLATFORM_UNLIMITED_' || owner_email || '_' || extract(epoch from now())::text, 'sha256'), 'hex'),
    license_key = 'AIKEYS_FINANCIAL_PLATFORM_UNLIMITED_' || extract(epoch from now())::text
WHERE owner_email = 'tito.guevara@gmail.com'
    AND is_active = TRUE;

-- Add platform configuration for unlimited scaling
INSERT INTO public.platform_config (config_key, encrypted_value, checksum) VALUES 
('user_limit', 'unlimited', encode(digest('unlimited', 'sha256'), 'hex')),
('scaling_mode', 'enterprise_unlimited', encode(digest('enterprise_unlimited', 'sha256'), 'hex')),
('capacity_monitoring', 'enabled', encode(digest('enabled', 'sha256'), 'hex'))
ON CONFLICT (config_key) DO UPDATE SET 
    encrypted_value = EXCLUDED.encrypted_value,
    checksum = EXCLUDED.checksum,
    updated_at = now();