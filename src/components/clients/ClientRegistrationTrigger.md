
# Client Registration Trigger

To automatically create a client record whenever a new user with CLIENT role is added to the profiles table, 
we need to add the following SQL function and trigger to the Supabase database:

```sql
-- Function to create a client record when a new CLIENT user is created
CREATE OR REPLACE FUNCTION public.handle_new_client_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user has the CLIENT role
  IF NEW.role = 'CLIENT' THEN
    -- Insert a new client record for this user
    INSERT INTO public.clients (
      id,
      user_id,
      business_name,
      contact_name,
      email,
      status,
      balance,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      NEW.id,
      NEW.name,
      NEW.name,
      NEW.email,
      'active',
      0,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicates if client already exists
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table
CREATE TRIGGER on_client_user_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_client_user();

-- Also handle role changes to CLIENT
CREATE TRIGGER on_client_role_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role <> 'CLIENT' AND NEW.role = 'CLIENT')
  EXECUTE PROCEDURE public.handle_new_client_user();
```

This SQL needs to be executed in the Supabase SQL Editor. After implementing these triggers, every new user with the role 'CLIENT' will automatically have a corresponding client record created.
