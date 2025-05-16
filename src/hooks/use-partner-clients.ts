
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types';
import { generateUuid } from '@/lib/supabase-utils';

export interface UsePartnerClientsProps {
  partnerId: string;
}

export const usePartnerClients = ({ partnerId }: UsePartnerClientsProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', partnerId);

      if (error) {
        throw error;
      }

      setClients(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Mutation to create a new client
  const createClient = useMutation({
    mutationFn: async (client: Partial<Client>) => {
      // Generate a UUID for the new client
      const newClientId = await generateUuid();
      
      if (!newClientId) {
        throw new Error('Failed to generate UUID');
      }

      // Make sure business_name is provided
      if (!client.business_name) {
        throw new Error('Business name is required');
      }
      
      // Insert new client with partner association
      const { error } = await supabase
        .from('clients')
        .insert({
          id: newClientId,
          partner_id: partnerId,
          business_name: client.business_name,
          contact_name: client.contact_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          state: client.state,
          zip: client.zip,
          document: client.document,
          status: client.status || 'ACTIVE',
        });
      
      if (error) {
        throw error;
      }
      
      return { ...client, id: newClientId, partner_id: partnerId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerClients', partnerId] });
      toast({
        title: 'Cliente criado',
        description: 'O cliente foi criado com sucesso.',
      });
      fetchClients();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao criar cliente: ${error.message}`,
      });
    },
  });

  // Mutation to delete a client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerClients', partnerId] });
      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi excluído com sucesso.',
      });
      fetchClients();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao excluir cliente: ${error.message}`,
      });
    },
  });

  // Mutation to update a client
  const updateClient = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Client> & { id: string }) => {
      const { error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerClients', partnerId] });
      toast({
        title: 'Cliente atualizado',
        description: 'O cliente foi atualizado com sucesso.',
      });
      fetchClients();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao atualizar cliente: ${error.message}`,
      });
    },
  });

  return {
    clients,
    isLoading: loading,
    error,
    fetchClients,
    createClient,
    deleteClient,
    updateClient,
  };
};
