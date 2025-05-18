
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useClientBalance = (clientId?: string | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchBalance = async () => {
    if (!clientId) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientId)
        .single();

      if (error) {
        setError(error);
      } else if (data) {
        setBalance(data.balance);
      } else {
        setBalance(0);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "ID do cliente não fornecido",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ balance: newBalance })
        .eq('id', clientId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setBalance(newBalance);
      toast({
        title: "Saldo atualizado",
        description: `Novo saldo: R$ ${newBalance.toFixed(2)}`,
        variant: "default",
      });
      
      return data;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Erro ao atualizar saldo",
        description: err.message || "Ocorreu um erro ao atualizar o saldo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [clientId]);
  
  const sendBalanceNotification = async (client: Client, newBalance: number) => {
    try {
      if (!client?.id) return;
      
      // Get the user_id for this client
      const { data: userData, error: userError } = await supabase
        .from('user_client_access')
        .select('user_id')
        .eq('client_id', client.id)
        .maybeSingle();
      
      if (userError || !userData?.user_id) {
        console.error('Error finding user for client notification:', userError);
        return;
      }
      
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.user_id,
          title: "Atualização de Saldo",
          message: `O saldo da sua conta foi atualizado para R$ ${newBalance.toFixed(2)}`,
          type: "BALANCE", // Use string literal instead of enum reference
          data: {
            balance: newBalance,
            previous_balance: client.balance || 0,
            operation_date: new Date().toISOString()
          },
          is_read: false
        });
        
    } catch (error) {
      console.error('Error sending balance notification:', error);
    }
  };

  return { 
    balance, 
    isLoading, 
    error, 
    refreshBalance: fetchBalance, 
    sendBalanceNotification,
    updateBalance
  };
};
