
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';

export const usePartnerClients = (partnerId?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      if (!partnerId) {
        // For demo purposes, use mock data if no partnerId is provided
        setClients([
          {
            id: "1",
            business_name: "Empresa Modelo",
            contact_name: "João Silva",
            email: "joao@empresa.com",
            phone: "(11) 99999-8888",
            status: "active",
            balance: 1500,
            partner_id: "1"
          },
          {
            id: "2",
            business_name: "Comércio ABC",
            contact_name: "Maria Souza",
            email: "maria@comercioabc.com",
            phone: "(11) 97777-6666",
            status: "pending",
            balance: 800,
            partner_id: "1"
          }
        ]);
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
