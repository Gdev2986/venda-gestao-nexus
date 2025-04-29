
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Client = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  partner_id?: string;
  document?: string;
  created_at?: string;
  updated_at?: string;
};

export type ClientFormData = Omit<Client, "id" | "created_at" | "updated_at">;

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Function to fetch clients from Supabase in the future
  const fetchClients = async () => {
    setLoading(true);
    try {
      // For now, using mock data
      // In the future, we can uncomment the Supabase code below
      
      /* 
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      setClients(data || []);
      */
      
      // Mock data for now
      // This would be replaced by the actual data from Supabase
      setTimeout(() => {
        const mockClients: Client[] = [
          {
            id: "1",
            business_name: "Empresa 1 Ltda.",
            contact_name: "João Silva",
            email: "joao@empresa1.com",
            phone: "(11) 98765-4321",
            address: "Rua A, 123",
            city: "São Paulo",
            state: "SP",
            zip: "01234-567",
            document: "12.345.678/0001-99",
            created_at: "2023-01-01T12:00:00Z",
            updated_at: "2023-01-01T12:00:00Z",
          },
          {
            id: "2",
            business_name: "Empresa 2 S.A.",
            contact_name: "Maria Souza",
            email: "maria@empresa2.com",
            phone: "(11) 91234-5678",
            address: "Av. B, 456",
            city: "Rio de Janeiro",
            state: "RJ",
            zip: "20000-123",
            document: "98.765.432/0001-10",
            created_at: "2023-02-15T10:30:00Z",
            updated_at: "2023-02-15T10:30:00Z",
          },
        ];
        setClients(mockClients);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const addClient = async (client: ClientFormData) => {
    try {
      // For now, adding to local state
      // In the future, we would add to Supabase
      
      /* 
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select();
      
      if (error) throw error;
      setClients(prev => [...prev, data[0]]);
      */
      
      // Mock adding for now
      const newClient: Client = {
        ...client,
        id: Date.now().toString(), // Mock ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setClients(prev => [...prev, newClient]);
      
      toast({
        title: "Cliente adicionado",
        description: "Cliente cadastrado com sucesso.",
      });
      
      return newClient;
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Não foi possível cadastrar o cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateClient = async (id: string, client: ClientFormData) => {
    try {
      // For now, updating local state
      // In the future, we would update in Supabase
      
      /* 
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      setClients(prev => prev.map(c => c.id === id ? { ...data[0] } : c));
      */
      
      // Mock updating for now
      setClients(prev => prev.map(c => c.id === id ? { 
        ...c,
        ...client,
        updated_at: new Date().toISOString() 
      } : c));
      
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // For now, deleting from local state
      // In the future, we would delete from Supabase
      
      /* 
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      */
      
      // Mock deleting for now
      setClients(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
}
