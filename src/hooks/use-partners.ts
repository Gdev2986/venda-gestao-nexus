
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Partner = {
  id: string;
  company_name: string;
  contact_name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
};

export type FilterValues = {
  search: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
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
      const { data, error: insertError } = await supabase
        .from("partners")
        .insert([partnerData])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setPartners((prev) => [...prev, data as Partner]);
      setFilteredPartners((prev) => [...prev, data as Partner]);
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
          partner.company_name.toLowerCase().includes(search) ||
          (partner.business_name && partner.business_name.toLowerCase().includes(search)) ||
          (partner.contact_name && partner.contact_name.toLowerCase().includes(search)) ||
          (partner.email && partner.email.toLowerCase().includes(search))
      );
    }

    if (commissionRange) {
      const [min, max] = commissionRange;
      filtered = filtered.filter(
        (partner) => partner.commission_rate >= min && partner.commission_rate <= max
      );
    }

    setFilteredPartners(filtered);
  }, [partners]);

  return {
    partners,
    filteredPartners,
    isLoading,
    error,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
  };
}
