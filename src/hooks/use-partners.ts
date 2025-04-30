
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Partner as PartnerType } from "@/types";

export type PartnerStatus = "active" | "inactive";

export interface Partner extends Omit<PartnerType, "id" | "created_at" | "updated_at"> {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface FilterValues {
  search?: string;
  dateRange?: { from: Date; to: Date } | null;
  status?: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateRange: null,
    status: "all",
  });
  const { toast } = useToast();

  const fetchPartners = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from("partners").select("*");

      // Apply search filter
      if (filters.search) {
        query = query.ilike("company_name", `%${filters.search}%`);
      }

      // Apply date range filter
      if (filters.dateRange) {
        const { from, to } = filters.dateRange;
        // Ensure we have both from and to dates
        if (from && to) {
          // Format dates for PostgreSQL compatibility
          const fromDate = from.toISOString();
          const toDate = to.toISOString();
          query = query.gte("created_at", fromDate).lte("created_at", toDate);
        }
      }

      // Execute the query
      const { data, error: fetchError } = await query.order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Map the returned data to match our Partner interface
      const mappedPartners = data.map(partner => ({
        id: partner.id,
        business_name: partner.company_name, // Map company_name to business_name
        commission_rate: partner.commission_rate,
        created_at: partner.created_at,
        updated_at: partner.updated_at,
        contact_name: "John Doe", // Mock data, replace with actual data when available
        email: "contact@example.com", // Mock data
        phone: "(123) 456-7890", // Mock data
        status: "active" as PartnerStatus, // Mock data
        total_clients: 5, // Mock data
        address: "123 Business St, City", // Mock data
        city: "New York", // Mock data
        state: "NY", // Mock data
        zip: "10001", // Mock data
      }));

      setPartners(mappedPartners);
    } catch (err: any) {
      console.error("Error fetching partners:", err);
      setError(err.message || "Error fetching partners");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load partners. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [filters]);

  const addPartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      setIsLoading(true);

      // Extract only the fields that exist in the database table
      const { business_name, commission_rate } = partnerData;

      const { data, error } = await supabase
        .from("partners")
        .insert([{ company_name: business_name, commission_rate }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        // Map the returned data to match our Partner interface
        const newPartner: Partner = {
          id: data[0].id,
          business_name: data[0].company_name, // Map company_name to business_name
          commission_rate: data[0].commission_rate,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          // Add mock data for other fields
          contact_name: partnerData.contact_name || "New Partner",
          email: partnerData.email || "partner@example.com",
          phone: partnerData.phone || "(000) 000-0000",
          status: partnerData.status || "active",
          address: partnerData.address || "No address provided",
          city: partnerData.city || "City",
          state: partnerData.state || "State",
          zip: partnerData.zip || "00000",
          total_clients: 0
        };

        setPartners([newPartner, ...partners]);

        toast({
          title: "Partner Added",
          description: "Partner has been successfully added.",
        });
      }
    } catch (err: any) {
      console.error("Error adding partner:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add partner.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Add missing methods required by Partners.tsx
  const handleFilter = handleFilterChange;

  const deletePartner = async (partnerId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId);
      
      if (error) throw error;
      
      // Remove partner from local state
      setPartners(partners.filter(partner => partner.id !== partnerId));
      
      toast({
        title: "Partner Deleted",
        description: "Partner has been successfully deleted."
      });
      
      return true;
    } catch (err: any) {
      console.error("Error deleting partner:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete partner."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const savePartner = async (partnerData: Omit<Partner, "created_at" | "updated_at">, partnerId?: string) => {
    try {
      setIsLoading(true);
      
      // Extract only the fields that exist in the database table
      const { business_name, commission_rate } = partnerData;
      
      let result;
      
      if (partnerId) {
        // Update existing partner
        result = await supabase
          .from("partners")
          .update({ company_name: business_name, commission_rate })
          .eq("id", partnerId)
          .select();
      } else {
        // Insert new partner
        result = await supabase
          .from("partners")
          .insert([{ company_name: business_name, commission_rate }])
          .select();
      }
      
      const { data, error } = result;
      
      if (error) throw error;
      
      if (data && data[0]) {
        toast({
          title: partnerId ? "Partner Updated" : "Partner Added",
          description: `Partner has been successfully ${partnerId ? "updated" : "added"}.`
        });
        
        // Refresh partners list
        fetchPartners();
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error("Error saving partner:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save partner."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPartners = fetchPartners;

  return {
    partners,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleFilter,
    deletePartner,
    savePartner,
    refreshPartners,
    addPartner,
    fetchPartners,
  };
};
