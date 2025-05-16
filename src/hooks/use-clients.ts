
import { useState, useCallback } from 'react';
import { Client } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the required structure for client creation
export type ClientCreate = {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  document?: string;
  partner_id?: string;
  user_id?: string;
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch all clients from the database
  const refreshClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) throw new Error(error.message);
      
      setClients(data as Client[]);
      setFilteredClients(data as Client[]);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load clients.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter clients based on search term and status
  const filterClients = useCallback((searchTerm: string, status: string) => {
    let filtered = [...clients];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        (client.business_name && client.business_name.toLowerCase().includes(lowerSearchTerm)) ||
        (client.contact_name && client.contact_name.toLowerCase().includes(lowerSearchTerm)) ||
        (client.email && client.email.toLowerCase().includes(lowerSearchTerm)) ||
        (client.document && client.document.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(client => client.status === status);
    }
    
    setFilteredClients(filtered);
  }, [clients]);

  // Add a new client
  const addClient = async (clientData: ClientCreate): Promise<Client | false> => {
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newClient = data as Client;
      setClients(prevClients => [...prevClients, newClient]);
      setFilteredClients(prevFiltered => [...prevFiltered, newClient]);
      
      return newClient;
    } catch (err) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add client."
      });
      return false;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, clientData: Partial<ClientCreate>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedClients = clients.map(client => {
        if (client.id === id) {
          return { ...client, ...clientData };
        }
        return client;
      });
      
      setClients(updatedClients);
      setFilteredClients(updatedClients.filter(client => filteredClients.some(fc => fc.id === client.id)));
      
      return true;
    } catch (err) {
      console.error("Error updating client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update client."
      });
      return false;
    }
  };

  // Delete a client
  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setClients(clients.filter(client => client.id !== id));
      setFilteredClients(filteredClients.filter(client => client.id !== id));
      
      return true;
    } catch (err) {
      console.error("Error deleting client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete client."
      });
      return false;
    }
  };

  return {
    clients: filteredClients,
    loading,
    error,
    refreshClients,
    filterClients,
    addClient,
    updateClient,
    deleteClient,
  };
};
