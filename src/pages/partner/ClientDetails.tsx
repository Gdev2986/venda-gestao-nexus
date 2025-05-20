
// Import the updated_at field to the client data structure
// Add a sample implementation if the file doesn't exist
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Ensure we include the updated_at field
        setClient({
          id: data.id,
          business_name: data.business_name,
          email: data.email || '',
          phone: data.phone || '',
          status: data.status || 'ACTIVE',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          balance: data.balance || 0,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at, // Use created_at as fallback
          // Add other required fields as needed
        });
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [id]);

  if (loading) {
    return <div>Loading client details...</div>;
  }
  
  if (!client) {
    return <div>Client not found</div>;
  }
  
  return (
    <div>
      <h1>Client Details</h1>
      <p>Name: {client.business_name}</p>
      <p>Email: {client.email}</p>
      <p>Phone: {client.phone}</p>
      <p>Status: {client.status}</p>
    </div>
  );
};

export default ClientDetails;
