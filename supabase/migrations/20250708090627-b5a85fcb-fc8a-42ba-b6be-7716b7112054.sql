-- Make dasadasa25ra@gmail.com admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'dasadasa25ra@gmail.com';

-- Update the trigger function to make this email admin by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Set admin role for specific emails
  IF NEW.email = 'admin@trinity.ai' OR NEW.email = 'dasadasa25ra@gmail.com' THEN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'admin');
  ELSE
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
  END IF;
  RETURN NEW;
END;
$$;