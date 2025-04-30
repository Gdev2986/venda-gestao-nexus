
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Partner {
  id: string;
  business_name: string;  // We use business_name consistently
  contact_name?: string;
  email?: string;
  phone?: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
}

// Define a type for filter values that can be used in other components
export type FilterValues = {
  search?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('business_name', { ascending: true });

      if (error) throw error;

      // Map the data to Partner interface - handle potential field name differences
      const mappedPartners: Partner[] = data.map((partner) => ({
        id: partner.id,
        business_name: partner.business_name || partner.company_name, // Handle both field names
        contact_name: partner.contact_name,
        email: partner.email,
        phone: partner.phone,
        commission_rate: partner.commission_rate,
        created_at: partner.created_at,
        updated_at: partner.updated_at,
      }));

      setPartners(mappedPartners);
      setFilteredPartners(mappedPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os parceiros.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filters: Partial<Partner>) => {
    setIsFiltering(true);
    try {
      let filtered = [...partners];

      if (filters.business_name) {
        filtered = filtered.filter(partner => 
          partner.business_name.toLowerCase().includes(filters.business_name!.toLowerCase())
        );
      }

      if (filters.contact_name) {
        filtered = filtered.filter(partner => 
          partner.contact_name?.toLowerCase().includes(filters.contact_name!.toLowerCase())
        );
      }

      if (filters.email) {
        filtered = filtered.filter(partner => 
          partner.email?.toLowerCase().includes(filters.email!.toLowerCase())
        );
      }

      setFilteredPartners(filtered);
    } catch (error) {
      console.error('Error filtering partners:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  const createPartner = async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Convert business_name to company_name for database compatibility if needed
      const dbPartnerData = {
        business_name: partnerData.business_name,
        contact_name: partnerData.contact_name,
        email: partnerData.email,
        phone: partnerData.phone,
        commission_rate: partnerData.commission_rate,
      };

      const { data, error } = await supabase
        .from('partners')
        .insert([dbPartnerData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Map the returned data to our Partner interface
        const newPartner: Partner = {
          id: data[0].id,
          business_name: data[0].business_name || data[0].company_name,
          contact_name: data[0].contact_name,
          email: data[0].email,
          phone: data[0].phone,
          commission_rate: data[0].commission_rate,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
        };

        setPartners([...partners, newPartner]);
        setFilteredPartners([...filteredPartners, newPartner]);
        toast({
          title: "Sucesso",
          description: "Parceiro criado com sucesso.",
        });
        return newPartner;
      }
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o parceiro.",
        variant: "destructive",
      });
    }
    return null;
  };

  const updatePartner = async (id: string, partnerData: Partial<Partner>) => {
    try {
      // Convert business_name to company_name for database if needed
      const dbPartnerData: Record<string, any> = {};
      if (partnerData.business_name) dbPartnerData.business_name = partnerData.business_name;
      if (partnerData.contact_name) dbPartnerData.contact_name = partnerData.contact_name;
      if (partnerData.email) dbPartnerData.email = partnerData.email;
      if (partnerData.phone) dbPartnerData.phone = partnerData.phone;
      if (partnerData.commission_rate !== undefined) dbPartnerData.commission_rate = partnerData.commission_rate;
      
      const { data, error } = await supabase
        .from('partners')
        .update(dbPartnerData)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Map the returned data to our Partner interface
        const updatedPartner: Partner = {
          id: data[0].id,
          business_name: data[0].business_name || data[0].company_name,
          contact_name: data[0].contact_name,
          email: data[0].email,
          phone: data[0].phone,
          commission_rate: data[0].commission_rate,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
        };
        
        const updatedPartners = partners.map(p => 
          p.id === id ? updatedPartner : p
        );
        setPartners(updatedPartners);
        setFilteredPartners(updatedPartners);
        toast({
          title: "Sucesso",
          description: "Parceiro atualizado com sucesso.",
        });
        return updatedPartner;
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o parceiro.",
        variant: "destructive",
      });
    }
    return null;
  };

  const deletePartner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedPartners = partners.filter(p => p.id !== id);
      setPartners(updatedPartners);
      setFilteredPartners(updatedPartners);
      toast({
        title: "Sucesso",
        description: "Parceiro excluído com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o parceiro.",
        variant: "destructive",
      });
      return false;
    }
  };

  const savePartner = async (partner: Partner) => {
    if (partner.id) {
      return await updatePartner(partner.id, partner);
    } else {
      // Remover id, created_at e updated_at para criar um novo parceiro
      const { id, created_at, updated_at, ...newPartnerData } = partner;
      return await createPartner(newPartnerData);
    }
  };

  const refreshPartners = async () => {
    await fetchPartners();
  };

  return {
    partners,
    filteredPartners,
    isLoading,
    isFiltering,
    fetchPartners,
    handleFilter,
    createPartner,
    updatePartner,
    deletePartner,
    savePartner,
    refreshPartners
  };
};
