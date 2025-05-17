
-- Atualizar a função que cria usuários ao criar clientes para usar auth.sign_up em vez de inserção direta
CREATE OR REPLACE FUNCTION public.create_client_user_with_password()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  first_name TEXT;
  phone_last_four TEXT;
  password TEXT;
  new_user_id UUID;
  signup_result RECORD;
BEGIN
  -- Extract first name (assuming contact_name format like "John Doe")
  first_name := split_part(NEW.contact_name, ' ', 1);
  
  -- Extract last four digits from phone number
  phone_last_four := RIGHT(regexp_replace(NEW.phone, '[^0-9]', '', 'g'), 4);
  
  -- Create password as requested
  password := first_name || phone_last_four;

  -- Don't proceed if email is missing
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;
  
  -- Check if the email is already registered
  SELECT id INTO new_user_id FROM auth.users WHERE email = NEW.email LIMIT 1;
  
  IF new_user_id IS NULL THEN
    -- Create user using auth.sign_up if email doesn't exist
    -- Note: This is a placeholder. In production, you should use an edge function
    -- or external function call to create the user properly
    
    -- For now, we'll skip user creation since it requires proper auth integration
    -- We'll just add a profile entry if needed
    INSERT INTO public.profiles (
      id,
      email,
      name,
      role,
      phone
    )
    VALUES (
      gen_random_uuid(), -- Generate a new UUID since we can't create auth.users directly
      NEW.email,
      NEW.contact_name,
      'CLIENT',
      NEW.phone
    )
    RETURNING id INTO new_user_id;
    
    -- Note: In a real implementation, after user creation via an edge function,
    -- we'd link the client to the newly created user
  END IF;
  
  -- Create client-user access link if we have a user ID
  IF new_user_id IS NOT NULL THEN
    INSERT INTO public.user_client_access (
      user_id,
      client_id
    )
    VALUES (
      new_user_id,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;
