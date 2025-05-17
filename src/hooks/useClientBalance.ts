
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

      if (clientError) {
        console.error('Client error:', clientError);
        throw new Error('Cliente não encontrado');
      }

      if (!clientData) {
        throw new Error('Dados do cliente não encontrados');
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

      // Check if balance_transactions table exists
      // If database errors occur, you may need to comment out this block or create the table
      try {
        // Record the transaction if possible
        await supabase
          .from('client_logs')
          .insert({
            client_id: clientId,
            action_type: amount > 0 ? 'credit' : 'debit',
            previous_value: JSON.stringify({ balance: currentBalance }),
            new_value: JSON.stringify({ balance: newBalance }),
            changed_by: 'system',
          });
      } catch (error) {
        console.error('Error recording transaction (non-critical):', error);
        // Continue execution even if transaction recording fails
      }

      // Try to send a notification if user_id exists
      try {
        // Get user_id from user_client_access table
        const { data: userAccess } = await supabase
          .from('user_client_access')
          .select('user_id')
          .eq('client_id', clientId)
          .single();

        if (userAccess && userAccess.user_id) {
          await supabase.from("notifications").insert({
            user_id: userAccess.user_id,
            title: "Saldo Atualizado",
            message: `Seu saldo foi ${amount > 0 ? "aumentado" : "diminuído"} em R$ ${Math.abs(amount).toFixed(2)} ${description ? `: ${description}` : ''}`,
            type: NotificationType.BALANCE,
            data: JSON.stringify({ amount, previous_balance: currentBalance, new_balance: newBalance })
          });
        }
      } catch (error) {
        console.error('Failed to send notification (non-critical):', error);
        // Continue even if notification fails
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
