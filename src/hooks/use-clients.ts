
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getClients = async (): Promise<Client[]> => {
    setLoading(true);
    setError(null);

    try {
      const clients = await fetchClients();
      return clients;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const getClientById = async (id: string): Promise<Client | null> => {
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

  const addClient = async (clientData: ClientCreate): Promise<Client> => {
    setLoading(true);
    setError(null);

    try {
      const newClient = await createClient(clientData);
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
    loading,
    error,
    getClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
  };
}
