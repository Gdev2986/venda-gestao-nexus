
# Updated Handle New User Function

For proper integration between auth users and client records, we should modify the existing `handle_new_user` function to properly set up the relationship:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_role text := 'CLIENT';
  user_name text;
BEGIN
  -- Extract name from metadata or email
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  -- Create profile record
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    default_role
  );

  -- If role is CLIENT, also create a client record
  IF default_role = 'CLIENT' THEN
    INSERT INTO public.clients (
      id, 
      user_id,
      business_name,
      contact_name,
      email,
      status,
      balance
    ) VALUES (
      gen_random_uuid(),
      NEW.id,
      user_name,
      user_name,
      NEW.email,
      'active',
      0
    );
  END IF;

  RETURN NEW;
END;
$$;
```

This updated function will:
1. Create a profile for each new user (as it did before)
2. Additionally create a client record if the user has the CLIENT role
3. Link the user_id to the client record for proper association
