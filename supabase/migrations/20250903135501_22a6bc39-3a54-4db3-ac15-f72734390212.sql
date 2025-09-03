-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
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

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle organization role memberships
CREATE OR REPLACE FUNCTION public.create_organization_membership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
DECLARE
  user_profile_id uuid;
BEGIN
  -- Get the profile ID for the current user
  SELECT id INTO user_profile_id
  FROM profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Create organization membership with owner role
  IF user_profile_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
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