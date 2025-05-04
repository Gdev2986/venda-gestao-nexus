
import { useState, useEffect } from "react";
import { Client, Partner } from "@/types";
import { 
  fetchClients, 
  fetchPartners, 
  fetchFeePlans,
  createClient,
  updateClient,
  deleteClient
} from "@/api/clientsEnhancedApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface UseClientsAdminProps {
  initialPage?: number;
  pageSize?: number;
}

export function useClientsAdmin({ initialPage = 1, pageSize = 50 }: UseClientsAdminProps = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [feePlans, setFeePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalClients, setTotalClients] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const totalPages = Math.ceil(totalClients / pageSize);

  // Load all clients
  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const { clients, count } = await fetchClients(currentPage, pageSize);
      setClients(clients);
      setTotalClients(count);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load all partners
  const loadPartners = async () => {
    try {
      const fetchedPartners = await fetchPartners();
      setPartners(fetchedPartners);
    } catch (err: any) {
      toast({
        title: "Aviso",
        description: "Não foi possível carregar a lista de parceiros.",
      });
    }
  };

  // Load all fee plans
  const loadFeePlans = async () => {
    try {
      const fetchedFeePlans = await fetchFeePlans();
      setFeePlans(fetchedFeePlans);
    } catch (err: any) {
      toast({
        title: "Aviso",
        description: "Não foi possível carregar os planos de taxa.",
      });
    }
  };

  // Create a new client
  const addClient = async (clientData: Partial<Client>) => {
    setLoading(true);
    try {
      const { success, client, error: createError } = await createClient(clientData);
      
      if (success && client) {
        setClients(prev => [...prev, client]);
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso!",
        });
        return { success: true, client };
      } else {
        throw new Error(createError || "Erro ao criar cliente");
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Não foi possível criar o cliente.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a client
  const editClient = async (id: string, clientData: Partial<Client>) => {
    setLoading(true);
    try {
      const { success, client, error: updateError } = await updateClient(id, clientData);
      
      if (success && client) {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...client } : c));
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso!",
        });
        return { success: true, client };
      } else {
        throw new Error(updateError || "Erro ao atualizar cliente");
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a client
  const removeClient = async (id: string) => {
    setLoading(true);
    try {
      const { success, error: deleteError } = await deleteClient(id);
      
      if (success) {
        setClients(prev => prev.filter(c => c.id !== id));
        toast({
          title: "Sucesso",
          description: "Cliente removido com sucesso!",
        });
        return { success: true };
      } else {
        throw new Error(deleteError || "Erro ao remover cliente");
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Não foi possível remover o cliente.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Load initial data
  useEffect(() => {
    loadClients();
    loadPartners();
    loadFeePlans();
  }, [currentPage]);

  return {
    clients,
    partners,
    feePlans,
    loading,
    error,
    totalPages,
    currentPage,
    addClient,
    editClient,
    removeClient,
    handlePageChange
  };
}
