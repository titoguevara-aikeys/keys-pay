-- Update platform license with correct domains and owner information
-- Clear existing test data and insert production configuration
DELETE FROM public.platform_license;
DELETE FROM public.platform_config WHERE config_key IN ('domain_whitelist', 'owner_email');

-- Insert production platform license for AIKEYS Financial Platform
INSERT INTO public.platform_license (
    license_key, 
    owner_email, 
    domain_whitelist, 
    is_active, 
    expires_at, 
    features, 
    max_users,
    digital_signature
) VALUES (
    'AIKEYS_FINANCIAL_PLATFORM_LICENSE_' || extract(epoch from now())::text,
    'tito.guevara@gmail.com',
    ARRAY['www.aikeys.ai', 'www.aikeys-hub.com', 'aikeys.ai', 'aikeys-hub.com', 'localhost'],
    TRUE,
    NULL, -- No expiration for owner
    jsonb_build_object(
        'family_controls', true,
        'crypto_trading', true,
        'merchant_services', true,
        'international_transfers', true,
        'advanced_analytics', true,
        'white_label', true,
        'unlimited_users', true
    ),
    100000, -- High user limit for enterprise platform
    encode(digest('AIKEYS_FINANCIAL_PLATFORM_' || 'tito.guevara@gmail.com' || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
);

-- Insert platform configuration with correct domains
INSERT INTO public.platform_config (config_key, encrypted_value, checksum) VALUES 
('owner_email', 'tito.guevara@gmail.com', encode(digest('tito.guevara@gmail.com', 'sha256'), 'hex')),
('platform_name', 'AIKEYS Financial Platform', encode(digest('AIKEYS Financial Platform', 'sha256'), 'hex')),
('primary_domain', 'www.aikeys-hub.com', encode(digest('www.aikeys-hub.com', 'sha256'), 'hex')),
('company_domain', 'www.aikeys.ai', encode(digest('www.aikeys.ai', 'sha256'), 'hex')),
('backup_frequency', 'daily', encode(digest('daily', 'sha256'), 'hex')),
('security_level', 'maximum', encode(digest('maximum', 'sha256'), 'hex'));

-- Ensure owner profile is properly configured with protected status
UPDATE public.profiles 
SET 
    role = 'super_admin',
    is_protected_owner = TRUE,
    owner_since = now(),
    platform_signature = encode(digest('AIKEYS_FINANCIAL_PLATFORM_OWNER_' || user_id::text || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
WHERE email = 'tito.guevara@gmail.com';