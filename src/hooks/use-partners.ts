
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PartnerStatus = "active" | "inactive";

export interface Partner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  // Additional fields
  contact_name?: string;
  email?: string;
  phone?: string;
  status?: PartnerStatus;
  total_clients?: number;
  address?: string;
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
        company_name: partner.company_name,
        commission_rate: partner.commission_rate,
        created_at: partner.created_at,
        updated_at: partner.updated_at,
        contact_name: "John Doe", // Mock data, replace with actual data when available
        email: "contact@example.com", // Mock data
        phone: "(123) 456-7890", // Mock data
        status: "active" as PartnerStatus, // Mock data
        total_clients: 5, // Mock data
        address: "123 Business St, City" // Mock data
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
      const { company_name, commission_rate } = partnerData;

      const { data, error } = await supabase
        .from("partners")
        .insert([{ company_name, commission_rate }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        // Map the returned data to match our Partner interface
        const newPartner: Partner = {
          id: data[0].id,
          company_name: data[0].company_name,
          commission_rate: data[0].commission_rate,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          // Add mock data for other fields
          contact_name: partnerData.contact_name || "New Partner",
          email: partnerData.email || "partner@example.com",
          phone: partnerData.phone || "(000) 000-0000",
          status: partnerData.status || "active",
          address: partnerData.address || "No address provided"
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

  return {
    partners,
    isLoading,
    error,
    filters,
    handleFilterChange,
    addPartner,
    fetchPartners,
  };
};
