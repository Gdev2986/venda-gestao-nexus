
-- Create a database function to get clients without tax block
CREATE OR REPLACE FUNCTION get_clients_without_tax_block()
RETURNS TABLE(
  id UUID,
  business_name TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT c.id, c.business_name 
  FROM clients c
  WHERE c.id NOT IN (
    SELECT client_id FROM client_tax_blocks
  )
  ORDER BY c.business_name;
$$;
