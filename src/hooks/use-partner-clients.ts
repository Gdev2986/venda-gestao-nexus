
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Interface for client creation
interface ClientCreate {
  business_name: string;
  email?: string;
  phone?: string;
  status?: string;
  contact_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  document?: string;
  partner_id?: string;
}

export const usePartnerClients = (partnerId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      let query = supabase.from('clients').select('*');
      
      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setClients(data);
        setFilteredClients(data);
      }
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients");
      
      // Use mock data in case of error
      const mockClients: Client[] = [
        {
          id: "1",
          business_name: "ABC Company",
          email: "contact@abc.com",
          phone: "(11) 99999-8888",
          status: "active",
          partner_id: partnerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          business_name: "XYZ Enterprise",
          email: "info@xyz.com",
          phone: "(11) 88888-7777",
          status: "active",
          partner_id: partnerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      setClients(mockClients);
      setFilteredClients(mockClients);
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, toast]);

  const filterClients = useCallback((searchTerm = "", status = "") => {
    let filtered = [...clients];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.business_name.toLowerCase().includes(term) ||
        (client.email && client.email.toLowerCase().includes(term)) ||
        (client.phone && client.phone.includes(term)) ||
        (client.document && client.document.includes(term))
      );
    }

    if (status && status !== "all") {
      filtered = filtered.filter(client => client.status === status);
    }

    setFilteredClients(filtered);
    return filtered;
  }, [clients]);

  const createClient = async (clientData: ClientCreate): Promise<boolean> => {
    try {
      // First generate a UUID for the client
      const { data: idData } = await supabase.rpc('generate_uuid');
      const clientId = idData;
      
      // Insert with the new ID
      const { error } = await supabase
        .from('clients')
        .insert({
          id: clientId,
          ...clientData
        });

      if (error) throw error;

      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso."
      });

      await fetchClients(); // Refresh the clients list
      return true;
    } catch (err: any) {
      console.error("Error creating client:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível criar o cliente."
      });
      
      return false;
    }
  };
  
  const updateClient = async (clientId: string, clientData: Partial<Client>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Cliente atualizado",
        description: "As informações foram atualizadas com sucesso."
      });

      await fetchClients(); // Refresh the clients list
      return true;
    } catch (err: any) {
      console.error("Error updating client:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível atualizar o cliente."
      });
      
      return false;
    }
  };

  const deleteClient = async (clientId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso."
      });

      await fetchClients(); // Refresh the clients list
      return true;
    } catch (err: any) {
      console.error("Error deleting client:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível remover o cliente."
      });
      
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients: filteredClients,
    allClients: clients,
    isLoading,
    error,
    refreshClients: fetchClients,
    filterClients,
    createClient,
    updateClient,
    deleteClient
  };
};
