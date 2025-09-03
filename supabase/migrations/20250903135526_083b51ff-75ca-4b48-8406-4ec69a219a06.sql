-- Fix security issues from previous migration
-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer 
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    now(),
    now()
  );
  RETURN new;
END;
$$;

-- Update create_organization_membership function with proper search_path
CREATE OR REPLACE FUNCTION public.create_organization_membership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer 
SET search_path = public, pg_temp
AS $$
DECLARE
  user_profile_id uuid;
BEGIN
  -- Get the profile ID for the current user
  SELECT id INTO user_profile_id
  FROM public.profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Create organization membership with owner role
  IF user_profile_id IS NOT NULL THEN
    INSERT INTO public.organization_memberships (
      organization_id,
      profile_id,
      role,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      user_profile_id,
      'owner',
      now(),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;