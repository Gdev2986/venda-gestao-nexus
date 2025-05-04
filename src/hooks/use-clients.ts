
import { useState, useEffect } from "react";
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

  useEffect(() => {
    getClients().catch(err => console.error("Error loading clients:", err));
  }, []);

  const getClients = async (): Promise<Client[]> => {
    setLoading(true);
    setError(null);

    try {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
      return fetchedClients;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const getClient = async (id: string): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const client = await fetchClientById(id);
      return client;
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
      if (!client) throw new Error(`Client with id ${id} not found`);
      return client;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: ClientCreate): Promise<Client> => {
    setLoading(true);
    setError(null);

    try {
      const newClient = await createClient(clientData);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: ClientUpdate): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedClient = await apiUpdateClient(id, clientData);
      if (updatedClient) {
        setClients(prev => 
          prev.map(client => client.id === id ? updatedClient : client)
        );
      }
      return updatedClient;
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
        setClients(prev => prev.filter(client => client.id !== id));
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

  return {
    clients,
    loading,
    error,
    getClients,
    getClient,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
  };
}
