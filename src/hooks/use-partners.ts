
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Partner } from '@/types';
import { generateUuid } from '@/lib/supabase-utils';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*');

      if (error) {
        throw error;
      }

      setPartners(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Mutation to create a new partner
  const createPartner = useMutation({
    mutationFn: async ({ company_name, commission_rate = 0, ...rest }: Partial<Partner>) => {
      // Generate a UUID for the new partner
      const newPartnerId = await generateUuid();
      
      if (!newPartnerId) {
        throw new Error('Failed to generate UUID');
      }
      
      // Ensure company_name is provided
      if (!company_name) {
        throw new Error('Company name is required');
      }
      
      const { error } = await supabase
        .from('partners')
        .insert({
          id: newPartnerId,
          company_name,
          commission_rate,
          ...rest
        });
        
      if (error) throw error;
      
      return { id: newPartnerId, company_name, commission_rate, ...rest };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: 'Parceiro criado',
        description: 'O parceiro foi criado com sucesso.',
      });
      fetchPartners();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao criar parceiro: ${error.message}`,
      });
    },
  });

  // Mutation to delete a partner
  const deletePartner = useMutation({
    mutationFn: async (partnerId: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: 'Parceiro excluído',
        description: 'O parceiro foi excluído com sucesso.',
      });
      fetchPartners();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao excluir parceiro: ${error.message}`,
      });
    },
  });

  // Mutation to update a partner
  const updatePartner = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Partner> & { id: string }) => {
      const { error } = await supabase
        .from('partners')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: 'Parceiro atualizado',
        description: 'O parceiro foi atualizado com sucesso.',
      });
      fetchPartners();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao atualizar parceiro: ${error.message}`,
      });
    },
  });

  return {
    partners,
    isLoading: loading,
    error,
    isCreatingPartner: false, // This would be updated when using the mutation
    createPartner,
    updatePartner,
    deletePartner
  };
};
