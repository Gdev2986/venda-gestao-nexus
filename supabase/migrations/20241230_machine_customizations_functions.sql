
-- Function to get machine customizations for a client
CREATE OR REPLACE FUNCTION get_machine_customizations(p_client_id UUID)
RETURNS TABLE (
  id UUID,
  machine_id UUID,
  client_id UUID,
  custom_name TEXT,
  custom_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.machine_id,
    mc.client_id,
    mc.custom_name,
    mc.custom_location,
    mc.created_at,
    mc.updated_at
  FROM public.machine_customizations mc
  WHERE mc.client_id = p_client_id;
END;
$$;

-- Function to upsert machine customization
CREATE OR REPLACE FUNCTION upsert_machine_customization(
  p_machine_id UUID,
  p_client_id UUID,
  p_custom_name TEXT,
  p_custom_location TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.machine_customizations (
    machine_id,
    client_id,
    custom_name,
    custom_location
  )
  VALUES (
    p_machine_id,
    p_client_id,
    p_custom_name,
    p_custom_location
  )
  ON CONFLICT (machine_id, client_id)
  DO UPDATE SET
    custom_name = EXCLUDED.custom_name,
    custom_location = EXCLUDED.custom_location,
    updated_at = now();
END;
$$;
