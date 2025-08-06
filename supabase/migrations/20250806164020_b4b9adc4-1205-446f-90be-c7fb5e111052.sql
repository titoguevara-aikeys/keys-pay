-- Promote current user to admin role
UPDATE public.profiles 
SET role = 'admin'::public.app_role 
WHERE email = 'tito.guevara@gmail.com';