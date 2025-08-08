-- Add membership_tier column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN membership_tier TEXT DEFAULT 'regular' CHECK (membership_tier IN ('regular', 'silver', 'gold', 'platinum', 'vip'));

-- Update tito.guevara@gmail.com user to VIP membership
UPDATE public.profiles 
SET membership_tier = 'vip', updated_at = now()
WHERE email = 'tito.guevara@gmail.com';