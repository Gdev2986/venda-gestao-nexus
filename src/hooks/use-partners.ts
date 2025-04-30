
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the Partner interface based on the actual database structure
export interface Partner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
  // Additional fields that PartnersTable.tsx expects
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  document?: string;
  status?: "active" | "inactive";
}

export interface FilterValues {
  search?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Transform the data to match the Partner interface
      const transformedData = data.map(partner => ({
        ...partner,
        business_name: partner.company_name, // Map company_name to business_name
        contact_name: '', // Add default values for fields not in the database
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        status: 'active' as const
      }));

      setPartners(transformedData as Partner[]);
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar parceiros',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPartner = async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError('');

      // Transform the partner data to match the database schema
      const partnerData = {
        company_name: partner.business_name,
        commission_rate: partner.commission_rate
      };

      const { data, error: createError } = await supabase
        .from('partners')
        .insert([partnerData])
        .select();

      if (createError) {
        throw new Error(createError.message);
      }

      if (data && data.length > 0) {
        // Transform the returned data to match the Partner interface
        const newPartner = {
          ...data[0],
          business_name: data[0].company_name,
          contact_name: partner.contact_name,
          email: partner.email,
          phone: partner.phone,
          address: partner.address,
          city: partner.city,
          state: partner.state,
          zip: partner.zip,
          status: 'active' as const
        };

        setPartners(prev => [...prev, newPartner as Partner]);
        toast({
          title: 'Parceiro criado',
          description: 'O parceiro foi criado com sucesso.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar parceiro',
        description: err.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, partner: Partial<Omit<Partner, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      setError('');

      // Transform the partner data to match the database schema
      const partnerData: { company_name?: string; commission_rate?: number } = {};
      
      if (partner.business_name) {
        partnerData.company_name = partner.business_name;
      }
      
      if (partner.commission_rate !== undefined) {
        partnerData.commission_rate = partner.commission_rate;
      }

      const { data, error: updateError } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', id)
        .select();

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (data && data.length > 0) {
        // Update the local partners state
        setPartners(prev =>
          prev.map(p => (p.id === id ? {
            ...p,
            ...partner,
            company_name: partner.business_name || p.company_name,
            business_name: partner.business_name || p.business_name
          } as Partner : p))
        );
        
        toast({
          title: 'Parceiro atualizado',
          description: 'O parceiro foi atualizado com sucesso.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar parceiro',
        description: err.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      setLoading(true);
      setError('');

      const { error: deleteError } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setPartners(prev => prev.filter(partner => partner.id !== id));
      toast({
        title: 'Parceiro excluído',
        description: 'O parceiro foi excluído com sucesso.',
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir parceiro',
        description: err.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = (filters: FilterValues) => {
    // This is a client-side filter implementation
    if (!filters.search) return partners;
    
    const searchLower = filters.search.toLowerCase();
    return partners.filter((partner) => 
      partner.business_name.toLowerCase().includes(searchLower) || 
      partner.company_name.toLowerCase().includes(searchLower)
    );
  };

  return {
    partners,
    loading,
    error,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
  };
};
