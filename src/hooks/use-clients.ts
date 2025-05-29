import { useState, useCallback } from 'react';
import { Client } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the required structure for client creation
export type ClientCreate = {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  document?: string;
  partner_id?: string;
  balance?: number;
};

export type ClientUserCreationResult = {
  success: boolean;
  user_id?: string;
  email?: string;
  temp_password?: string;
  expires_at?: string;
  error?: string;
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refreshClients = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) throw new Error(error.message);
      
      const clientData = data || [];
      setClients(clientData as Client[]);
      setFilteredClients(clientData as Client[]);
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
      setIsLoading(false);
    }
  }, [toast]);

  const filterClients = useCallback((searchTerm: string, status: string) => {
    let filtered = [...clients];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.business_name.toLowerCase().includes(lowerSearchTerm) ||
        client.contact_name?.toLowerCase().includes(lowerSearchTerm) ||
        client.email?.toLowerCase().includes(lowerSearchTerm) ||
        (client.document && client.document.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(client => client.status === status);
    }
    
    setFilteredClients(filtered);
  }, [clients]);

  // Create user via edge function
  const createClientUser = async (clientData: ClientCreate, clientId: string): Promise<ClientUserCreationResult> => {
    try {
      console.log('Calling create-client-user edge function for:', clientData.email);
      
      const { data, error } = await supabase.functions.invoke('create-client-user', {
        body: {
          email: clientData.email,
          contact_name: clientData.contact_name,
          phone: clientData.phone,
          client_id: clientId,
          business_name: clientData.business_name
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create user');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to create user');
      }

      console.log('User created successfully via edge function:', data);
      return data as ClientUserCreationResult;
      
    } catch (error: any) {
      console.error('Error calling create-client-user function:', error);
      return {
        success: false,
        error: error.message || 'Failed to create user'
      };
    }
  };

  // Enhanced client creation with complete user setup
  const addClient = async (clientData: ClientCreate): Promise<{ client: Client | false; userResult?: ClientUserCreationResult }> => {
    try {
      console.log('Creating client with data:', clientData);
      
      // First, create the client record
      const { data: clientRecord, error: clientError } = await supabase
        .from('clients')
        .insert({
          business_name: clientData.business_name,
          contact_name: clientData.contact_name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          zip: clientData.zip,
          document: clientData.document,
          partner_id: clientData.partner_id,
          balance: clientData.balance || 0,
          status: 'ACTIVE'
        })
        .select()
        .single();
      
      if (clientError) {
        console.error("Error creating client:", clientError);
        throw new Error(`Failed to create client: ${clientError.message}`);
      }
      
      const newClient = clientRecord as Client;
      console.log('Client created successfully:', newClient.id);
      
      // Then create the user and all associated records
      const userResult = await createClientUser(clientData, newClient.id);
      
      if (!userResult.success) {
        // If user creation fails, we should delete the client to maintain consistency
        await supabase.from('clients').delete().eq('id', newClient.id);
        throw new Error(userResult.error || 'Failed to create user for client');
      }
      
      // Update local state
      setClients(prevClients => [...prevClients, newClient]);
      setFilteredClients(prevFiltered => [...prevFiltered, newClient]);
      
      toast({
        title: "Cliente criado com sucesso",
        description: "O cliente e usuário foram criados. Credenciais temporárias geradas.",
      });
      
      return { client: newClient, userResult };
      
    } catch (err) {
      console.error("Error in addClient:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err instanceof Error ? err.message : "Falha ao criar cliente."
      });
      return { client: false };
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientCreate>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);
      
      if (error) throw error;
      
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

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedClients = clients.filter(client => client.id !== id);
      
      setClients(updatedClients);
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
    isLoading,
    error,
    refreshClients,
    filterClients,
    addClient,
    updateClient,
    deleteClient,
    createClientUser,
  };
};
