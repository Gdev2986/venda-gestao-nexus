import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";

interface PartnerClient {
  id: string;
  business_name: string;
  email?: string;
  phone?: string;
  status?: string;
  balance?: number;
  partner_id?: string;
  created_at?: string;
  updated_at?: string;
  contact_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  document?: string;
}

// Break circular reference by using separate interface
interface PartnerClientWithRelations extends PartnerClient {
  clients: PartnerClient[];
}

interface UsePartnerClientsProps {
  partnerId?: string;
}

export const usePartnerClients = ({ partnerId }: UsePartnerClientsProps = {}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (partnerId) {
      fetchClients();
    }
  }, [partnerId]);

  const fetchClients = async () => {
    if (!partnerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', partnerId);

      if (error) {
        throw new Error(error.message);
      }

      const processedClients = data.map((client: any) => ({
        id: client.id,
        business_name: client.business_name,
        email: client.email,
        phone: client.phone,
        status: client.status,
        balance: client.balance || 0,
        partner_id: client.partner_id,
        created_at: client.created_at,
        updated_at: client.updated_at,
        contact_name: client.contact_name,
        address: client.address,
        city: client.city,
        state: client.state,
        zip: client.zip,
        document: client.document
      }));

      setClients(processedClients);
      setFilteredClients(processedClients);
    } catch (err: any) {
      console.error("Error fetching partner clients:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = (searchTerm: string = "") => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.business_name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phone?.includes(term) ||
        client.contact_name?.toLowerCase().includes(term)
    );

    setFilteredClients(filtered);
  };

  const addClient = async (clientData: Partial<Client>): Promise<boolean> => {
    try {
      if (!partnerId) {
        throw new Error("Partner ID is required to add a client");
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          partner_id: partnerId,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });

      await fetchClients();
      return true;
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cliente",
        description: err.message,
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

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });

      await fetchClients();
      return true;
    } catch (err: any) {
      console.error("Error updating client:", err);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: err.message,
      });
      return false;
    }
  };

  const removeClient = async (clientId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });

      await fetchClients();
      return true;
    } catch (err: any) {
      console.error("Error removing client:", err);
      toast({
        variant: "destructive",
        title: "Erro ao remover cliente",
        description: err.message,
      });
      return false;
    }
  };

  return {
    clients: filteredClients,
    allClients: clients,
    isLoading,
    error,
    filterClients,
    addClient,
    updateClient,
    removeClient,
    refreshClients: fetchClients,
  };
};
