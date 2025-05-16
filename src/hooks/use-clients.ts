
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import { ClientCreate, ClientUpdate } from "@/types/client";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("business_name", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setClients(data || []);
      return data;
    } catch (e: any) {
      const errorMsg = e.message || "Failed to fetch clients";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getClientById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (e: any) {
      const errorMsg = e.message || "Failed to fetch client";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (client: ClientCreate) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a UUID for the new client
      const { data: insertData, error: insertError } = await supabase
        .from("clients")
        .insert({
          business_name: client.business_name,
          contact_name: client.contact_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          state: client.state,
          zip: client.zip,
          document: client.document,
          partner_id: client.partner_id
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (insertData) {
        setClients((prev) => [...prev, insertData]);
        return insertData;
      }
      
      return null;
    } catch (e: any) {
      const errorMsg = e.message || "Failed to add client";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setClients((prev) =>
          prev.map((client) => (client.id === id ? data : client))
        );
        return data;
      }
      
      return null;
    } catch (e: any) {
      const errorMsg = e.message || "Failed to update client";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setClients((prev) => prev.filter((client) => client.id !== id));
      return true;
    } catch (e: any) {
      const errorMsg = e.message || "Failed to delete client";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
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
    getClientById,
    addClient,
    updateClient,
    deleteClient,
  };
};
