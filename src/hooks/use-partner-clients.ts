
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface UsePartnerClientsProps {
  partnerId?: string;
  enabled?: boolean;
  initialData?: Client[];
}

export const usePartnerClients = ({
  partnerId,
  enabled = true,
  initialData = [],
}: UsePartnerClientsProps = {}) => {
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchClients = async () => {
    let query = supabase.from("clients").select("*");

    if (partnerId) {
      query = query.eq("partner_id", partnerId);
    }

    const { data, error } = await query.order("business_name", {
      ascending: true,
    });

    if (error) {
      throw error;
    }

    return data || [];
  };

  const { data: clients = initialData, isLoading, error } = useQuery({
    queryKey: ["partnerClients", partnerId],
    queryFn: fetchClients,
    enabled,
  });

  const createClientMutation = useMutation({
    mutationFn: async (clientData: Partial<Client>) => {
      setIsCreatingClient(true);
      try {
        const { data: generatedUUID, error: uuidError } = await supabase.rpc(
          'generate_uuid'
        );

        if (uuidError) {
          throw new Error(`Failed to generate UUID: ${uuidError.message}`);
        }

        const clientId = generatedUUID;

        // Ensure business_name is set
        if (!clientData.business_name) {
          throw new Error("Business name is required");
        }

        const { data, error } = await supabase.from("clients").insert({
            id: clientId,
            ...clientData,
            ...(partnerId ? { partner_id: partnerId } : {}),
            business_name: clientData.business_name // Ensuring it's explicitly set
        }).select();

        if (error) {
          throw error;
        }

        return data[0];
      } finally {
        setIsCreatingClient(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerClients", partnerId] });
      toast({
        title: "Success",
        description: "Client created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create client: ${error.message}`,
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...clientData }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerClients", partnerId] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update client: ${error.message}`,
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerClients", partnerId] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete client: ${error.message}`,
      });
    },
  });

  return {
    clients,
    isLoading,
    error,
    isCreatingClient,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
};
