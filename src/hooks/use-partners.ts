
import { useState, useEffect, useCallback } from "react";
import { Partner } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Create a type that matches what's in the database
interface PartnerRecord {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  // Optional fields that may or may not be in the database
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  total_sales?: number;
  total_commission?: number;
  user_id?: string;
}

// Create a type that matches what we need to insert into the database
type PartnerInsert = Omit<
  Pick<PartnerRecord, 'company_name' | 'commission_rate' | 'contact_name' | 'email' | 'phone' | 'address' | 'user_id'>, 
  'id' | 'created_at' | 'updated_at'
>;

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
        // Transform data to match our Partner interface
        const transformedPartners: Partner[] = data.map((partner: PartnerRecord) => {
          // Create a properly typed partner object with available fields
          const typedPartner: Partner = {
            id: partner.id,
            company_name: partner.company_name,
            created_at: partner.created_at,
            updated_at: partner.updated_at,
            commission_rate: partner.commission_rate || 0,
            // Only include fields that are defined in the data object
            ...(partner.contact_name && { contact_name: partner.contact_name }),
            ...(partner.email && { email: partner.email }),
            ...(partner.phone && { phone: partner.phone }),
            ...(partner.address && { address: partner.address }),
            ...(partner.total_sales !== undefined && { total_sales: partner.total_sales }),
            ...(partner.total_commission !== undefined && { total_commission: partner.total_commission }),
            ...(partner.user_id && { user_id: partner.user_id }),
          };
          return typedPartner;
        });

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

  const createPartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      // Create a partner object with only the fields that exist in the database table
      const partnerToInsert = {
        company_name: partnerData.company_name,
        commission_rate: partnerData.commission_rate || 0,
        // Include optional fields if they exist in the data
        ...(partnerData.contact_name && { contact_name: partnerData.contact_name }),
        ...(partnerData.email && { email: partnerData.email }),
        ...(partnerData.phone && { phone: partnerData.phone }),
        ...(partnerData.address && { address: partnerData.address }),
        ...(partnerData.user_id && { user_id: partnerData.user_id }),
      };

      const { data, error } = await supabase
        .from('partners')
        .insert(partnerToInsert)
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
  
  const updatePartner = async (partnerId: string, partnerData: Partial<Partner>) => {
    try {
      // Create an update object with only the fields that exist in the database table
      const updateData: any = {};
      
      if (partnerData.company_name) updateData.company_name = partnerData.company_name;
      if (partnerData.commission_rate !== undefined) updateData.commission_rate = partnerData.commission_rate;
      if (partnerData.contact_name) updateData.contact_name = partnerData.contact_name;
      if (partnerData.email) updateData.email = partnerData.email;
      if (partnerData.phone) updateData.phone = partnerData.phone;
      if (partnerData.address) updateData.address = partnerData.address;

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

  const deletePartner = async (partnerId: string) => {
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
