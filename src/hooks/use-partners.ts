
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Partner } from "@/types";

export type FilterValues = {
  searchTerm: string;
  commissionRange?: [number, number];
};

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("partners")
        .select("*");

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const fetchedPartners = (data as Partner[]) || [];
      setPartners(fetchedPartners);
      setFilteredPartners(fetchedPartners);
    } catch (err: any) {
      console.error("Error fetching partners:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPartner = useCallback(async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true);
    try {
      // Generate an ID for the partner if not in Supabase environment
      const newPartner = {
        ...partnerData,
        id: uuidv4(),
      };

      const { data, error: insertError } = await supabase
        .from("partners")
        .insert([newPartner])
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const createdPartner = data?.[0] as Partner || newPartner;
      setPartners((prev) => [...prev, createdPartner]);
      setFilteredPartners((prev) => [...prev, createdPartner]);
      return true;
    } catch (err: any) {
      console.error("Error creating partner:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePartner = useCallback(async (id: string, partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from("partners")
        .update(partnerData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      const updatedPartner = data as Partner;
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? updatedPartner : p))
      );
      setFilteredPartners((prev) =>
        prev.map((p) => (p.id === id ? updatedPartner : p))
      );
      return true;
    } catch (err: any) {
      console.error("Error updating partner:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePartner = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("partners")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setPartners((prev) => prev.filter((p) => p.id !== id));
      setFilteredPartners((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting partner:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterPartners = useCallback((searchTerm: string, commissionRange?: [number, number]) => {
    if (!searchTerm && !commissionRange) {
      setFilteredPartners(partners);
      return;
    }

    let filtered = [...partners];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (partner) =>
          (partner.company_name && partner.company_name.toLowerCase().includes(search)) ||
          (partner.business_name && partner.business_name.toLowerCase().includes(search)) ||
          (partner.contact_name && partner.contact_name.toLowerCase().includes(search)) ||
          (partner.email && partner.email.toLowerCase().includes(search))
      );
    }

    if (commissionRange) {
      const [min, max] = commissionRange;
      filtered = filtered.filter(
        (partner) => partner.commission_rate != null && 
                    partner.commission_rate >= min && 
                    partner.commission_rate <= max
      );
    }

    setFilteredPartners(filtered);
  }, [partners]);

  return {
    partners: filteredPartners,
    loading: isLoading,
    error,
    filterPartners,
    createPartner,
    updatePartner,
    deletePartner,
    refreshPartners: fetchPartners
  };
}
