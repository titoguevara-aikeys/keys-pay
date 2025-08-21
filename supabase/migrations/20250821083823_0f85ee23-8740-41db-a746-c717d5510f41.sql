-- Fix authentication issues by ensuring proper profile creation and RLS policies

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'moderator', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role public.app_role NOT NULL DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  is_protected_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.profiles;

-- Create simplified, working RLS policies
CREATE POLICY "Enable read for users" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create or replace the user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name, 
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user'::public.app_role
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid();
$$;