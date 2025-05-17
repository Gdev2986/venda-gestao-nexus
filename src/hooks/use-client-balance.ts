
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UseClientBalanceReturn {
  balance: number | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function useClientBalance(): UseClientBalanceReturn {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBalance = async () => {
    if (!user) {
      setIsLoading(false);
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, get the client_id for the user
      const { data: clientData, error: clientError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        throw new Error('Failed to retrieve client information');
      }

      if (!clientData?.client_id) {
        setBalance(null);
        return;
      }

      const { data, error: balanceError } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientData.client_id)
        .single();

      if (balanceError) {
        throw new Error(balanceError.message);
      }

      setBalance(data?.balance || 0);
    } catch (err: any) {
      console.error('Error fetching client balance:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  return {
    balance,
    isLoading,
    error,
    mutate: fetchBalance
  };
}
