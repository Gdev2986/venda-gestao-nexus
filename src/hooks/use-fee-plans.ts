
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeePlan {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useFeePlans = () => {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeePlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fee_plans')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      // If there's no data (table might not exist yet), use mock data for development
      if (!data || data.length === 0) {
        setFeePlans([
          {
            id: 'plan-1',
            name: 'Básico (1%)',
            description: 'Plano básico com taxa de 1%',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'plan-2',
            name: 'Intermediário (2%)',
            description: 'Plano intermediário com taxa de 2%',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'plan-3',
            name: 'Premium (3%)',
            description: 'Plano premium com taxa de 3%',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } else {
        setFeePlans(data);
      }
      
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching fee plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeePlans();
  }, []);

  return {
    feePlans,
    isLoading,
    error,
    refetch: fetchFeePlans,
  };
};
