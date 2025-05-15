
import { useState, useEffect, useCallback } from "react";
import { Partner, FilterValues } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PartnerCreate {
  company_name: string;
  commission_rate: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Update SupabasePartner interface to match the actual database table structure
interface SupabasePartner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  // These fields might not exist in the database table
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  email?: string;
  phone?: string;
  address?: string;
  total_sales?: number;
  total_commission?: number;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch partners from Supabase
      const { data, error } = await supabase
        .from('partners')
        .select('*');

      if (error) throw error;

      if (data) {
        // Transform data to match our Partner interface with proper type checking
        const transformedPartners: Partner[] = data.map((partner: any) => ({
          id: partner.id,
          company_name: partner.company_name,
          created_at: partner.created_at,
          updated_at: partner.updated_at,
          commission_rate: partner.commission_rate,
          // Add optional fields with proper null checking
          contact_name: partner.contact_name || undefined,
          contact_email: partner.contact_email || undefined,
          contact_phone: partner.contact_phone || undefined,
          email: partner.email || undefined,
          phone: partner.phone || undefined,
          address: partner.address || undefined,
          total_sales: partner.total_sales || 0,
          total_commission: partner.total_commission || 0,
        }));

        setPartners(transformedPartners);
        setFilteredPartners(transformedPartners);
      }
    } catch (err: any) {
      console.error("Error fetching partners:", err);
      setError(err.message || "Failed to load partners");
      
      // Use mock data in case of error for demonstration
      const mockPartners: Partner[] = [
        {
          id: "1",
          company_name: "Tech Solutions Partners",
          contact_name: "João Silva",
          email: "joao@techsolutions.com",
          phone: "(11) 99877-6655",
          commission_rate: 5,
          address: "Av. Paulista, 1000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_sales: 45000,
          total_commission: 2250
        },
        {
          id: "2",
          company_name: "Connect Business",
          contact_name: "Maria Oliveira",
          email: "maria@connectbusiness.com",
          phone: "(11) 98765-4321",
          commission_rate: 4.5,
          address: "Rua Augusta, 500",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_sales: 32000,
          total_commission: 1440
        }
      ];
      
      setPartners(mockPartners);
      setFilteredPartners(mockPartners);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const filterPartners = useCallback((searchTerm = "", status = "") => {
    let filtered = [...partners];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(partner =>
        partner.company_name.toLowerCase().includes(term) ||
        (partner.contact_name && partner.contact_name.toLowerCase().includes(term)) ||
        (partner.email && partner.email.toLowerCase().includes(term)) ||
        (partner.phone && partner.phone.includes(term))
      );
    }

    setFilteredPartners(filtered);
  }, [partners]);

  const createPartner = async (partnerData: PartnerCreate): Promise<boolean> => {
    try {
      // Get Supabase table structure first
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'partners' });
      
      if (tableError) {
        console.error("Error getting table definition:", tableError);
      }

      // Only include fields that match the actual database schema
      // We know for sure company_name and commission_rate exist
      const { data, error } = await supabase
        .from('partners')
        .insert({
          company_name: partnerData.company_name,
          commission_rate: partnerData.commission_rate
        })
        .select();

      if (error) throw error;

      toast({
        title: "Parceiro criado",
        description: "O parceiro foi criado com sucesso."
      });

      await fetchPartners(); // Refresh the partners list
      return true;
    } catch (err: any) {
      console.error("Error creating partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível criar o parceiro."
      });
      
      return false;
    }
  };
  
  const updatePartner = async (partnerId: string, partnerData: Partial<Partner>): Promise<boolean> => {
    try {
      // Create an update object with only the fields that exist in the database table
      const updateData = {
        ...(partnerData.company_name && { company_name: partnerData.company_name }),
        ...(partnerData.commission_rate !== undefined && { commission_rate: partnerData.commission_rate }),
      };

      const { error } = await supabase
        .from('partners')
        .update(updateData)
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: "Parceiro atualizado",
        description: "As informações foram atualizadas com sucesso."
      });

      await fetchPartners(); // Refresh the partners list
      return true;
    } catch (err: any) {
      console.error("Error updating partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível atualizar o parceiro."
      });
      
      return false;
    }
  };

  const deletePartner = async (partnerId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: "Parceiro removido",
        description: "O parceiro foi removido com sucesso."
      });

      await fetchPartners(); // Refresh the partners list
      return true;
    } catch (err: any) {
      console.error("Error deleting partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível remover o parceiro."
      });
      
      return false;
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return {
    partners: filteredPartners,
    allPartners: partners,
    isLoading,
    error,
    refreshPartners: fetchPartners,
    filterPartners,
    createPartner,
    updatePartner,
    deletePartner
  };
};
