
-- Create a function to generate UUIDs for client-side usage
CREATE OR REPLACE FUNCTION public.generate_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;
