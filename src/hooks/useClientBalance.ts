
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface UseClientBalanceReturn {
  balance: number;
  isLoading: boolean;
  updateBalance: (clientId: string, amount: number, description: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export function useClientBalance(clientId?: string): UseClientBalanceReturn {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchBalance = async () => {
    if (!clientId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Get directly from clients table
      const { data, error } = await supabase
        .from("clients")
        .select("balance")
        .eq("id", clientId)
        .single();

      if (error) {
        throw error;
      }

      setBalance(data?.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast({
        title: "Erro ao carregar saldo",
        description: "Não foi possível carregar o saldo do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (clientId: string, amount: number, description: string) => {
    try {
      // Update client balance directly
      const { data: currentData, error: fetchError } = await supabase
        .from("clients")
        .select("balance")
        .eq("id", clientId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentBalance = currentData?.balance || 0;
      const newBalance = currentBalance + amount;

      const { error: updateError } = await supabase
        .from("clients")
        .update({ balance: newBalance })
        .eq("id", clientId);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setBalance(newBalance);
      
      // Show success message
      toast({
        title: "Saldo atualizado",
        description: amount > 0 
          ? `Valor adicionado ao saldo: ${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` 
          : `Valor debitado do saldo: ${Math.abs(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        variant: "default"
      });
      
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        title: "Erro ao atualizar saldo",
        description: "Não foi possível atualizar o saldo do cliente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [clientId]);

  return {
    balance,
    isLoading,
    updateBalance,
    refreshBalance: fetchBalance
  };
}
