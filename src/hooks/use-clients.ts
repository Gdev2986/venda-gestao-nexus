
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
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Added for backward compatibility
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch all clients from the database with extended information
  const refreshClients = useCallback(async () => {
    setLoading(true);
    setIsLoading(true); // Keep backward compatibility
    setError(null);
    try {
      console.log("Fetching clients from database...");
      
      // Fetch clients with their related information
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          client_fee_plans!inner(
            fee_plan:fee_plans(name)
          )
        `)
        .order('business_name', { ascending: true });

      if (clientsError) throw new Error(clientsError.message);

      // Also fetch clients without fee plans
      const { data: clientsWithoutPlans, error: clientsWithoutPlansError } = await supabase
        .from('clients')
        .select('*')
        .is('fee_plan_id', null)
        .order('business_name', { ascending: true });

      if (clientsWithoutPlansError) throw new Error(clientsWithoutPlansError.message);

      // Combine both results
      const allClients = [
        ...(clientsData || []),
        ...(clientsWithoutPlans || [])
      ];

      console.log("Fetched clients:", allClients);
      
      if (allClients && allClients.length > 0) {
        setClients(allClients as Client[]);
        setFilteredClients(allClients as Client[]);
      } else {
        console.log("No clients found in database");
        setClients([]);
        setFilteredClients([]);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar clientes.",
      });
    } finally {
      setLoading(false);
      setIsLoading(false); // Keep backward compatibility
    }
  }, [toast]);

  // Filter clients based on search term and status
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

  // Add a new client
  const addClient = async (clientData: ClientCreate): Promise<Client | false> => {
    try {
      console.log("Adding new client:", clientData);
      
      // Insert into Supabase 
      const { data, error } = await supabase
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
          status: 'ACTIVE'
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding client:", error);
        throw error;
      }
      
      const newClient = data as Client;
      
      setClients(prevClients => [...prevClients, newClient]);
      setFilteredClients(prevFiltered => [...prevFiltered, newClient]);
      
      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });
      
      return newClient;
    } catch (err) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err instanceof Error ? err.message : "Falha ao adicionar cliente."
      });
      return false;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, clientData: Partial<ClientCreate>): Promise<boolean> => {
    try {
      // Update in Supabase
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
      
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
      
      return true;
    } catch (err) {
      console.error("Error updating client:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao atualizar cliente."
      });
      return false;
    }
  };

  // Delete a client
  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedClients = clients.filter(client => client.id !== id);
      
      setClients(updatedClients);
      setFilteredClients(filteredClients.filter(client => client.id !== id));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting client:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir cliente."
      });
      return false;
    }
  };

  return {
    clients: filteredClients,
    loading,
    isLoading, // Added for backward compatibility
    error,
    refreshClients,
    filterClients,
    addClient,
    updateClient,
    deleteClient,
  };
};
