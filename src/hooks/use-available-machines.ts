
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Machine {
  id: string;
  serial_number: string;
  model: string;
}

export function useAvailableMachines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('machines')
          .select('id, serial_number, model')
          .is('client_id', null)
          .eq('status', 'ACTIVE')
          .order('serial_number', { ascending: true });

        if (error) {
          throw error;
        }

        setMachines(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar máquinas:', error);
        setError('Não foi possível carregar as máquinas disponíveis. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, []);

  return { machines, isLoading, error };
}
