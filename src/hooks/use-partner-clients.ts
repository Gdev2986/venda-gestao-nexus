
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';

export const usePartnerClients = (partnerId: string | undefined) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      if (!partnerId) {
        setClients([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('partner_id', partnerId);

        if (error) throw error;

        setClients(data || []);
      } catch (err: any) {
        console.error('Error fetching partner clients:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: `Failed to load clients: ${err.message}`,
          variant: 'destructive',
        });

        // Use mock data for demonstration if needed
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [partnerId, toast]);

  return { clients, isLoading, error };
};
