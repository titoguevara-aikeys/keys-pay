-- Remove the foreign key constraint on accounts table as well
-- This allows creating accounts for child profiles without auth users

ALTER TABLE public.accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;