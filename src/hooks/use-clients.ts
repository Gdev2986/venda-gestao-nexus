
import { useState, useCallback } from "react";
import { Client } from "@/types";
import { ClientCreate, ClientUpdate } from "@/types/client";
import { 
  fetchClients, 
  fetchClientById, 
  createClient, 
  updateClient as apiUpdateClient,
  deleteClientById 
} from "@/api/clientsApi";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const refreshClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
      return fetchedClients;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClients = async (): Promise<Client[]> => {
    setLoading(true);
    setError(null);

    try {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
      return fetchedClients;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const getClientById = async (id: string): Promise<Client> => {
    setLoading(true);
    setError(null);

    try {
      const client = await fetchClientById(id);
      if (!client) throw new Error(`Client with ID ${id} not found`);
      return client;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: ClientCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const newClient = await createClient(clientData);
      setClients((prevClients) => [...prevClients, newClient]);
      setFilteredClients((prevClients) => [...prevClients, newClient]);
      return true;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: ClientUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updatedClient = await apiUpdateClient(id, clientData);
      if (!updatedClient) return false;
      
      setClients((prevClients) => 
        prevClients.map(client => 
          client.id === id ? updatedClient : client
        )
      );
      
      setFilteredClients((prevClients) => 
        prevClients.map(client => 
          client.id === id ? updatedClient : client
        )
      );
      
      return true;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const success = await deleteClientById(id);
      if (success) {
        setClients((prevClients) => 
          prevClients.filter(client => client.id !== id)
        );
        setFilteredClients((prevClients) => 
          prevClients.filter(client => client.id !== id)
        );
      }
      return success;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const filterClients = useCallback((searchTerm: string, status: string) => {
    if (!clients.length) return;
    
    let filtered = [...clients];
    
    // Filter by search term if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.business_name?.toLowerCase().includes(searchLower) ||
          client.contact_name?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.document?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status if not 'all'
    if (status && status !== 'all') {
      filtered = filtered.filter((client) => client.status === status);
    }
    
    setFilteredClients(filtered);
  }, [clients]);

  return {
    clients: filteredClients,
    loading,
    error,
    getClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
    filterClients,
  };
}
