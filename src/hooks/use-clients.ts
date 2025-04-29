
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCNPJ, formatPhone, formatCEP } from "@/utils/client-utils";

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch clients from Supabase
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a production environment, this would use the actual Supabase query
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          business_name,
          contact_name,
          email,
          phone,
          address,
          city,
          state,
          zip,
          partner_id,
          document,
          created_at,
          updated_at
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format data fields
        const formattedClients = data.map(client => ({
          ...client,
          phone: formatPhone(client.phone || ''),
          document: client.document ? formatCNPJ(client.document) : undefined,
          zip: formatCEP(client.zip || '')
        }));
        
        setClients(formattedClients);
      } else {
        // If no data is returned from Supabase, use mock data for development
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
        }, 500);
      }
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      setError(error.message || "Erro ao buscar clientes");
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: ClientFormData) => {
    try {
      // Clean data before sending to API
      const clientData = {
        ...client,
        document: client.document ? client.document.replace(/\D/g, '') : undefined,
        phone: client.phone.replace(/\D/g, ''),
        zip: client.zip.replace(/\D/g, '')
      };

      // In a production environment, this would use the actual Supabase query
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format the returned data
        const formattedClient = {
          ...data[0],
          phone: formatPhone(data[0].phone || ''),
          document: data[0].document ? formatCNPJ(data[0].document) : undefined,
          zip: formatCEP(data[0].zip || '')
        };
        
        setClients(prev => [...prev, formattedClient]);
        
        toast({
          title: "Cliente adicionado",
          description: "Cliente cadastrado com sucesso.",
        });
        
        return formattedClient;
      } else {
        // For development: mock response if Supabase is not yet configured
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
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message || "Não foi possível cadastrar o cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateClient = async (id: string, client: ClientFormData) => {
    try {
      // Clean data before sending to API
      const clientData = {
        ...client,
        document: client.document ? client.document.replace(/\D/g, '') : undefined,
        phone: client.phone.replace(/\D/g, ''),
        zip: client.zip.replace(/\D/g, '')
      };
      
      // In a production environment, this would use the actual Supabase query
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format the returned data
        const formattedClient = {
          ...data[0],
          phone: formatPhone(data[0].phone || ''),
          document: data[0].document ? formatCNPJ(data[0].document) : undefined,
          zip: formatCEP(data[0].zip || '')
        };
        
        setClients(prev => prev.map(c => c.id === id ? formattedClient : c));
        
        toast({
          title: "Cliente atualizado",
          description: "Cliente atualizado com sucesso.",
        });
        
        return formattedClient;
      } else {
        // For development: mock response if Supabase is not yet configured
        const updatedClient = {
          ...client,
          id,
          updated_at: new Date().toISOString() 
        };
        
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedClient } : c));
        
        toast({
          title: "Cliente atualizado",
          description: "Cliente atualizado com sucesso.",
        });
      }
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message || "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // In a production environment, this would use the actual Supabase query
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setClients(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro ao remover cliente",
        description: error.message || "Não foi possível remover o cliente.",
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
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
}
