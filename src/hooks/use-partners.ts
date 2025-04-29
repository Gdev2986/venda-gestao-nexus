
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types";
import { useToast } from "./use-toast";

export interface FilterValues {
  search: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<FilterValues>({ search: "" });
  const { toast } = useToast();

  // Fetch partners with optional filtering
  const fetchPartners = async () => {
    setIsLoading(true);
    setError("");

    try {
      let query = supabase.from("partners").select("*");

      // Apply search filter if provided
      if (filters.search) {
        query = query.ilike("company_name", `%${filters.search}%`);
      }

      // Apply date range filter if provided
      if (filters.dateRange?.from) {
        const startDate = new Date(filters.dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        
        query = query.gte("created_at", startDate.toISOString());
        
        if (filters.dateRange.to) {
          const endDate = new Date(filters.dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          query = query.lte("created_at", endDate.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPartners(data || []);
    } catch (err: any) {
      console.error("Error fetching partners:", err);
      setError(err.message || "Failed to fetch partners");
      toast({
        title: "Error",
        description: "Failed to fetch partners data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  // Add new partner
  const addPartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      // Removed the "id" property since Supabase will generate it
      const { data, error } = await supabase
        .from("partners")
        .insert([{
          company_name: partnerData.company_name,
          commission_rate: partnerData.commission_rate
        }])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Partner created",
        description: "The partner has been successfully added.",
      });

      // Refresh partners list
      await fetchPartners();
      return { success: true, data };
    } catch (err: any) {
      console.error("Error adding partner:", err);
      toast({
        title: "Error",
        description: "Failed to add partner.",
        variant: "destructive",
      });
      return { success: false, error: err.message };
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPartners();
  }, [filters]);

  return {
    partners,
    isLoading,
    error,
    filters,
    handleFilterChange,
    addPartner,
    fetchPartners
  };
};
