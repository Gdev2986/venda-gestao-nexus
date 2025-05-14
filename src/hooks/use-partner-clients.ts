
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export const usePartnerClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First, get the partner ID for this user
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partnerError) throw new Error("Não foi possível encontrar sua conta de parceiro");

      const partnerId = partnerData?.id;
      if (!partnerId) {
        setIsLoading(false);
        return;
      }

      // Then fetch clients linked to this partner
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', partnerId);

      if (error) throw error;

      if (data) {
        // Fix: Explicitly cast to Client[] without using unknown as an intermediary type
        // This helps avoid the excessive type instantiation depth
        setClients(data as Client[]);
        setFilteredClients(data as Client[]);
      }
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Falha ao carregar clientes");
      
      // Use mock data in case of error for demonstration
      const mockClients: Client[] = [
        {
          id: "1",
          business_name: "Restaurante Bom Sabor",
          contact_name: "Antonio Oliveira",
          email: "contato@bomsabor.com",
          phone: "(11) 98765-4321",
          status: "active",
          balance: 2500.50,
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          created_at: new Date().toISOString(),
          partner_id: "1"
        },
        {
          id: "2",
          business_name: "Loja Tech Mais",
          contact_name: "Roberta Silva",
          email: "contato@techmais.com",
          phone: "(11) 91234-5678",
          status: "active",
          balance: 1800.00,
          address: "Av. Paulista, 500",
          city: "São Paulo",
          state: "SP",
          created_at: new Date().toISOString(),
          partner_id: "1"
        }
      ];
      
      setClients(mockClients);
      setFilteredClients(mockClients);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Define filterClients function separately to avoid recursion issues
  const filterClientsFunc = useCallback((searchTerm = "", status = "") => {
    let filtered = [...clients];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.business_name.toLowerCase().includes(term) ||
        (client.contact_name && client.contact_name.toLowerCase().includes(term)) ||
        (client.email && client.email.toLowerCase().includes(term)) ||
        (client.phone && client.phone.includes(term))
      );
    }

    if (status && status !== "all") {
      filtered = filtered.filter(client => client.status === status);
    }

    setFilteredClients(filtered);
  }, [clients]);

  const getClientSales = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error("Error fetching client sales:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as vendas deste cliente.",
      });
      return [];
    }
  };

  return {
    clients: filteredClients,
    allClients: clients,
    isLoading,
    error,
    refreshClients: fetchClients,
    filterClients: filterClientsFunc,
    getClientSales
  };
};
