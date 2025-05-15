
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { useToast } from "./use-toast";

export const usePartnerClients = (partnerId: string | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    if (!partnerId) return;

    try {
      setLoading(true);
      // Break infinite loop by limiting the depth of the select
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id, 
          business_name, 
          email, 
          phone, 
          status, 
          balance, 
          created_at, 
          updated_at, 
          contact_name, 
          address, 
          city, 
          state, 
          zip, 
          document
        `)
        .eq('partner_id', partnerId);

      if (error) throw error;
      
      setClients(data);
    } catch (error) {
      console.error('Error fetching partner clients:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar os clientes do parceiro."
      });
    } finally {
      setLoading(false);
    }
  }, [partnerId, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    refreshClients: fetchClients
  };
};

export default usePartnerClients;
