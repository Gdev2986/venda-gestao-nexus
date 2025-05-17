import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { NotificationType } from '@/types/enums';

interface ClientData {
  id: string;
  balance: number;
  user_id?: string;
}

export function useClientBalance() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getClientBalance = async (clientId: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client balance:', error);
        return null;
      }

      return data?.balance || 0;
    } catch (error) {
      console.error('Error in getClientBalance:', error);
      return null;
    }
  };

  const updateBalance = async (
    clientId: string,
    amount: number,
    description?: string,
    transactionType?: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Get current client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('balance, user_id')
        .eq('id', clientId)
        .single();

      if (clientError || !clientData) {
        throw new Error('Cliente não encontrado');
      }

      const currentBalance = clientData.balance || 0;
      const newBalance = currentBalance + amount;

      // Update client balance
      const { error: updateError } = await supabase
        .from('clients')
        .update({ balance: newBalance })
        .eq('id', clientId);

      if (updateError) {
        throw new Error('Erro ao atualizar saldo');
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('balance_transactions')
        .insert({
          client_id: clientId,
          amount,
          previous_balance: currentBalance,
          new_balance: newBalance,
          description: description || `Ajuste de saldo: ${amount > 0 ? '+' : ''}${amount}`,
          type: transactionType || (amount > 0 ? 'credit' : 'debit'),
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Continue execution even if transaction recording fails
      }

      // Send notification to client if user_id exists
      if (clientData.user_id) {
        const userId = clientData.user_id;
        
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Saldo Atualizado",
          message: `Seu saldo foi ${amount > 0 ? "aumentado" : "diminuído"} em R$ ${Math.abs(amount).toFixed(2)}`,
          type: "BALANCE",
          data: JSON.stringify({ amount, previous_balance: currentBalance, new_balance: newBalance })
        });
      }

      toast({
        title: 'Saldo atualizado',
        description: `O saldo foi ${amount > 0 ? 'aumentado' : 'diminuído'} em R$ ${Math.abs(amount).toFixed(2)}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating balance:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o saldo',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getClientBalance,
    updateBalance,
    isLoading,
  };
}
