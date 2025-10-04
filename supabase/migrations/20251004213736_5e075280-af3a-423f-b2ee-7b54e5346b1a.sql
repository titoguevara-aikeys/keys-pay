-- First, add columns without constraints
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text UNIQUE,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS membership_tier text DEFAULT 'silver',
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update any null or invalid values to defaults
UPDATE public.profiles 
SET membership_tier = 'silver' 
WHERE membership_tier IS NULL OR membership_tier NOT IN ('silver', 'gold', 'platinum');

UPDATE public.profiles 
SET kyc_status = 'pending' 
WHERE kyc_status IS NULL OR kyc_status NOT IN ('pending', 'verified', 'rejected');

UPDATE public.profiles 
SET preferred_language = 'en' 
WHERE preferred_language IS NULL OR preferred_language NOT IN ('en', 'ar');

UPDATE public.profiles 
SET onboarding_completed = false 
WHERE onboarding_completed IS NULL;

-- Now add the constraints
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_membership_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_membership_tier_check 
CHECK (membership_tier IN ('silver', 'gold', 'platinum'));

ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_kyc_status_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_kyc_status_check 
CHECK (kyc_status IN ('pending', 'verified', 'rejected'));

ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_preferred_language_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_preferred_language_check 
CHECK (preferred_language IN ('en', 'ar'));

COMMENT ON COLUMN public.profiles.membership_tier IS 'User membership level: silver (free), gold (premium), platinum (elite)';
COMMENT ON COLUMN public.profiles.kyc_status IS 'KYC verification status';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed initial onboarding wizard';