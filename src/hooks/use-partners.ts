
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Partner {
  id: string;
  business_name: string;  // Alterado de company_name para business_name
  contact_name?: string;
  email?: string;
  phone?: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
}

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

      // Map the data to Partner interface
      const mappedPartners: Partner[] = data.map((partner) => ({
        id: partner.id,
        business_name: partner.business_name,
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
      // Corrigido: Não incluir ID no insert, o Supabase gerará o UUID
      const { data, error } = await supabase
        .from('partners')
        .insert([partnerData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newPartner = data[0] as Partner;
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
      const { data, error } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedPartner = data[0] as Partner;
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
