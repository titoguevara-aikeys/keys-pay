-- Clear all family control data for the current user to allow fresh testing
-- This will remove all existing family members so you can test add/remove functionality

-- Delete family controls for the current user (replace with your actual user ID)
DELETE FROM public.family_controls 
WHERE parent_id = 'd25d1516-eb57-4baf-92e0-15069a6dc205';

-- Also clean up any orphaned child profiles that were created for testing
-- (profiles that don't have corresponding auth users)
DELETE FROM public.profiles 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
) AND user_id != 'd25d1516-eb57-4baf-92e0-15069a6dc205';

-- Clean up any orphaned accounts for test child profiles
DELETE FROM public.accounts 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
) AND user_id != 'd25d1516-eb57-4baf-92e0-15069a6dc205';

-- Clean up any orphaned security settings for test child profiles  
DELETE FROM public.security_settings 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
) AND user_id != 'd25d1516-eb57-4baf-92e0-15069a6dc205';