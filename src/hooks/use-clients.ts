
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

  // Fetch all clients from the database
  const refreshClients = useCallback(async () => {
    setLoading(true);
    setIsLoading(true); // Keep backward compatibility
    setError(null);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) throw new Error(error.message);
      
      // For development, let's provide mock data if no data is returned
      const clientData = data || [
        {
          id: "1",
          business_name: "Super Mercado Silva",
          contact_name: "João Silva",
          email: "joao@mercadosilva.com",
          phone: "(11) 98765-4321",
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          zip: "01310-100",
          partner_id: "1",
          document: "12.345.678/0001-90",
          status: "active"
        },
        {
          id: "2",
          business_name: "Padaria Central",
          contact_name: "Maria Oliveira",
          email: "maria@padariacentral.com",
          phone: "(11) 91234-5678",
          address: "Av. Brasil, 500",
          city: "Rio de Janeiro",
          state: "RJ",
          zip: "20940-070",
          partner_id: "2",
          document: "98.765.432/0001-10",
          status: "active"
        },
        {
          id: "3",
          business_name: "Lanchonete Boa Vista",
          contact_name: "Pedro Santos",
          email: "pedro@boavista.com",
          phone: "(31) 99876-5432",
          address: "Rua dos Pássaros, 45",
          city: "Belo Horizonte",
          state: "MG",
          zip: "30140-072",
          partner_id: "3",
          document: "45.678.901/0001-23",
          status: "inactive"
        }
      ];
      
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
        client.contact_name.toLowerCase().includes(lowerSearchTerm) ||
        client.email.toLowerCase().includes(lowerSearchTerm) ||
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
      // Try to insert into Supabase (this should work now with our policies)
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          status: 'active'
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
        description: "O cliente foi adicionado com sucesso e um usuário foi criado.",
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
      // Delete from Supabase
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
    isLoading, // Added for backward compatibility
    error,
    refreshClients,
    filterClients,
    addClient,
    updateClient,
    deleteClient,
  };
};
