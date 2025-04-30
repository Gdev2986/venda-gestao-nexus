
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type Partner = {
  id: string;
  company_name: string;
  commission_rate: number;
  contact_name?: string; 
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
};

type PartnersState = {
  partners: Partner[];
  isLoading: boolean;
  error: string | null;
  filteredPartners: Partner[];
};

type FilterPartners = (searchTerm: string, commissionRange: [number, number]) => void;

export function usePartners() {
  const [state, setState] = useState<PartnersState>({
    partners: [],
    isLoading: true,
    error: null,
    filteredPartners: [],
  });

  const fetchPartners = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setState({
        partners: data || [],
        filteredPartners: data || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partners',
      }));
    }
  };

  const createPartner = async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Add id for the insert operation
      const newPartner = {
        id: uuidv4(),
        ...partnerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('partners')
        .insert([newPartner]);

      if (error) {
        throw new Error(error.message);
      }

      // Refetch partners to get updated data
      await fetchPartners();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create partner',
      }));
      return false;
    }
  };

  const updatePartner = async (partnerId: string, partnerData: Partial<Partner>) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase
        .from('partners')
        .update({
          ...partnerData,
          updated_at: new Date().toISOString()
        })
        .eq('id', partnerId);

      if (error) {
        throw new Error(error.message);
      }

      // Refetch partners to get updated data
      await fetchPartners();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update partner',
      }));
      return false;
    }
  };

  const deletePartner = async (partnerId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchPartners();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete partner',
      }));
      return false;
    }
  };

  const filterPartners: FilterPartners = (searchTerm, commissionRange) => {
    const filtered = state.partners.filter(partner => {
      const matchesSearch = (
        (partner.company_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const commissionInRange = (
        partner.commission_rate >= commissionRange[0] && 
        partner.commission_rate <= commissionRange[1]
      );
      
      return matchesSearch && commissionInRange;
    });

    setState(prev => ({ ...prev, filteredPartners: filtered }));
  };

  // Load partners on mount
  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners: state.partners,
    filteredPartners: state.filteredPartners,
    isLoading: state.isLoading,
    error: state.error,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
  };
}
