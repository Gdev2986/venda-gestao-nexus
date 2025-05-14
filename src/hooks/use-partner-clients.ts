
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const usePartnerClients = (partnerId: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Define the fetchClients function with explicit return type
  const fetchClients = useCallback(async () => {
    if (!partnerId) {
      setClients([]);
      setFilteredClients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Query clients by partner_id
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', partnerId)
        .order('business_name', { ascending: true });

      if (error) throw error;

      if (data) {
        // Use a simple type assertion without chaining
        const clientData = data as unknown as Client[];
        setClients(clientData);
        setFilteredClients(clientData);
      }
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients");
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, toast]);

  // Execute the fetchClients function when the partnerId changes
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients based on a search term
  const filterClients = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = clients.filter((client) =>
      (client.business_name?.toLowerCase().includes(lowercaseSearch) ||
      client.contact_name?.toLowerCase().includes(lowercaseSearch) ||
      client.email?.toLowerCase().includes(lowercaseSearch))
    );
    
    setFilteredClients(filtered);
  }, [clients]);

  return {
    clients,
    filteredClients,
    isLoading,
    error,
    filterClients,
    refreshClients: fetchClients
  };
};
