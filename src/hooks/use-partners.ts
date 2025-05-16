
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UsePartnersOptions {
  enabled?: boolean;
  initialData?: Partner[];
  searchTerm?: string;
}

export const usePartners = ({
  enabled = true,
  initialData = [],
  searchTerm = "",
}: UsePartnersOptions = {}) => {
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchPartners = async () => {
    let query = supabase.from("partners").select("*");

    if (searchTerm) {
      query = query.ilike("company_name", `%${searchTerm}%`);
    }

    const { data, error } = await query.order("company_name", {
      ascending: true,
    });

    if (error) {
      throw error;
    }

    return data || [];
  };

  const { data: partners = initialData, isLoading, error } = useQuery({
    queryKey: ["partners", searchTerm],
    queryFn: fetchPartners,
    enabled,
  });

  const createPartnerMutation = useMutation({
    mutationFn: async (partnerData: Partial<Partner>) => {
      setIsCreatingPartner(true);
      try {
        // Generate UUID for the partner
        const { data: generatedUUID, error: uuidError } = await supabase.rpc(
          'generate_uuid'
        );

        if (uuidError) {
          throw new Error(`Failed to generate UUID: ${uuidError.message}`);
        }

        const partnerId = generatedUUID;

        // Ensure company_name is set
        if (!partnerData.company_name) {
          throw new Error("Company name is required");
        }

        const { data, error } = await supabase
          .from("partners")
          .insert({
            id: partnerId,
            company_name: partnerData.company_name,
            commission_rate: partnerData.commission_rate || 0
          })
          .select();

        if (error) {
          throw error;
        }

        return data[0];
      } finally {
        setIsCreatingPartner(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Success",
        description: "Partner created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create partner: ${error.message}`,
      });
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async ({
      id,
      ...partnerData
    }: Partial<Partner> & { id: string }) => {
      const { data, error } = await supabase
        .from("partners")
        .update(partnerData)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Success",
        description: "Partner updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update partner: ${error.message}`,
      });
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete partner: ${error.message}`,
      });
    },
  });

  return {
    partners,
    isLoading,
    error,
    isCreatingPartner,
    createPartner: createPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
  };
};
