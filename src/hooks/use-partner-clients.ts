import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, Partner } from '@/types';
import { useToast } from "@/hooks/use-toast";

export const usePartnerClients = (partnerId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, [partnerId]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('clients')
        .select('*')
        .order('business_name', { ascending: true });

      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setClients(data || []);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.map(client => client.id === clientId ? { ...client, ...updates } : client));
      toast({
        title: "Success",
        description: "Client updated successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // For inserting a client, we need to ensure an id is generated
  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Use the upsert method with a random uuid for the id
      const { error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          id: crypto.randomUUID() // Generate a UUID for the new client
        });

    if (error) throw error;
    
    await fetchClients();
    toast({
      title: "Success",
      description: "Client created successfully"
    });
    return true;
  } catch (error: any) {
    console.error("Error creating client:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const deleteClient = async (clientId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.filter(client => client.id !== clientId));
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    updateClient,
    createClient,
    deleteClient
  };
};
