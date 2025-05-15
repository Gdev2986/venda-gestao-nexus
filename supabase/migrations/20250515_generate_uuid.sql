
-- Function to generate UUIDs for client-side use
CREATE OR REPLACE FUNCTION public.generate_uuid()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT gen_random_uuid();
$$;
