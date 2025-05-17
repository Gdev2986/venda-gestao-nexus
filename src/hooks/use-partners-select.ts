
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  company_name: string;
}

export function usePartnersSelect() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('id, company_name')
          .order('company_name', { ascending: true });

        if (error) {
          throw error;
        }

        setPartners(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar parceiros:', error);
        setError('Não foi possível carregar os parceiros. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return { partners, isLoading, error };
}
