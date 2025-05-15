
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/types';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';

// Partner form values type that matches the Partner interface
export interface PartnerFormData {
  id?: string;
  company_name: string;
  commission_rate: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  email?: string;
  phone?: string;
  address?: string;
  total_sales?: number;
  total_commission?: number;
  business_name?: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('partners').select('*');
      if (error) throw error;

      // Transform the data from the database to match our Partner type
      const transformedPartners: Partner[] = data.map(p => ({
        id: p.id,
        company_name: p.company_name,
        commission_rate: p.commission_rate,
        created_at: p.created_at,
        updated_at: p.updated_at,
        contact_name: '', // Default empty values for properties that don't exist in DB
        contact_email: '',
        contact_phone: '',
        email: '',
        phone: '',
        address: '',
        total_sales: 0,
        total_commission: 0
      }));

      setPartners(transformedPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os parceiros."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const createPartner = async (partnerData: PartnerFormData): Promise<boolean> => {
    try {
      // Extract only the fields that exist in the database table
      const { company_name, commission_rate } = partnerData;
      
      // Generate a new UUID for the partner
      const partnerId = uuidv4();
      
      const { error } = await supabase.from('partners').insert({
        id: partnerId,
        company_name,
        commission_rate
      });

      if (error) throw error;

      toast({
        title: "Parceiro criado",
        description: "Parceiro foi criado com sucesso."
      });
      
      await fetchPartners();
      return true;
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o parceiro."
      });
      return false;
    }
  };

  const updatePartner = async (partnerData: PartnerFormData): Promise<boolean> => {
    try {
      // Extract only the fields that exist in the database table
      const { id, company_name, commission_rate } = partnerData;
      
      if (!id) {
        throw new Error("Partner ID is required for update");
      }

      const { error } = await supabase
        .from('partners')
        .update({
          company_name,
          commission_rate
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Parceiro atualizado",
        description: "Parceiro foi atualizado com sucesso."
      });
      
      await fetchPartners();
      return true;
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o parceiro."
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
        title: "Parceiro excluído",
        description: "Parceiro foi excluído com sucesso."
      });
      
      await fetchPartners();
      return true;
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o parceiro."
      });
      return false;
    }
  };

  return {
    partners,
    loading,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner
  };
};
