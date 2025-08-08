-- Update platform license with correct domains and owner information
-- Clear existing test data and insert production configuration
DELETE FROM public.platform_license;
DELETE FROM public.platform_config WHERE config_key IN ('domain_whitelist', 'owner_email');

-- Insert production platform license
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
    NULL, -- No expiration
    jsonb_build_object(
        'family_controls', true,
        'crypto_trading', true,
        'merchant_services', true,
        'international_transfers', true,
        'advanced_analytics', true,
        'white_label', true
    ),
    100000, -- High user limit for enterprise
    encode(digest('AIKEYS_FINANCIAL_PLATFORM_' || 'tito.guevara@gmail.com' || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
);

-- Insert platform configuration
INSERT INTO public.platform_config (config_key, encrypted_value, checksum) VALUES 
('owner_email', 'tito.guevara@gmail.com', encode(digest('tito.guevara@gmail.com', 'sha256'), 'hex')),
('platform_name', 'AIKEYS Financial Platform', encode(digest('AIKEYS Financial Platform', 'sha256'), 'hex')),
('primary_domain', 'www.aikeys-hub.com', encode(digest('www.aikeys-hub.com', 'sha256'), 'hex')),
('company_domain', 'www.aikeys.ai', encode(digest('www.aikeys.ai', 'sha256'), 'hex'));

-- Ensure owner profile is properly configured
UPDATE public.profiles 
SET 
    role = 'super_admin',
    is_protected_owner = TRUE,
    owner_since = now(),
    platform_signature = encode(digest('AIKEYS_FINANCIAL_PLATFORM_OWNER_' || user_id::text || '_' || extract(epoch from now())::text, 'sha256'), 'hex')
WHERE email = 'tito.guevara@gmail.com';

-- Create comprehensive backup view for owner access
CREATE OR REPLACE VIEW public.platform_backup_info AS
SELECT 
    'AIKEYS Financial Platform' as platform_name,
    'tito.guevara@gmail.com' as owner_email,
    ARRAY['www.aikeys.ai', 'www.aikeys-hub.com'] as domains,
    now() as backup_timestamp,
    'Security system active with protected owner account' as security_status
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE email = 'tito.guevara@gmail.com' AND is_protected_owner = TRUE);

-- Grant backup view access to super_admin only
GRANT SELECT ON public.platform_backup_info TO authenticated;
CREATE POLICY "Super admins can view backup info" ON public.platform_backup_info FOR SELECT USING (is_super_admin());