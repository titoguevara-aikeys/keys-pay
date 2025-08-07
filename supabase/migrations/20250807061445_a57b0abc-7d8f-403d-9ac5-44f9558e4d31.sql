-- Fix the foreign key constraint issue by allowing profiles without auth users
-- This is needed for child accounts that don't have authentication yet

-- First, check if the constraint exists and drop it
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Add a more flexible approach - we'll keep user_id as UUID but without the strict foreign key
-- This allows us to create placeholder profiles for children