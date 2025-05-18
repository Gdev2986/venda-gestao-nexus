
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UpdateBalanceParams {
  clientId: string;
  amount: number;
  reason?: string;
}

export function useClientBalance() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateBalance = async ({
    clientId,
    amount,
    reason = ''
  }: UpdateBalanceParams): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Você precisa estar logado para atualizar saldos."
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Get current balance
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientId)
        .single();

      if (clientError) {
        throw new Error(`Erro ao buscar cliente: ${clientError.message}`);
      }

      const currentBalance = clientData?.balance || 0;
      const newBalance = currentBalance + amount;

      // Update balance
      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (updateError) {
        throw new Error(`Erro ao atualizar saldo: ${updateError.message}`);
      }

      // Record the transaction in a log table (if exists)
      try {
        await supabase
          .from('balance_transactions')
          .insert({
            client_id: clientId,
            amount: amount,
            previous_balance: currentBalance,
            new_balance: newBalance,
            description: reason,
            created_by: user.id
          });
      } catch (logError) {
        console.warn("Could not log balance transaction:", logError);
        // Don't throw here, the main operation succeeded
      }

      // Send notification to client (optional)
      try {
        const operationName = amount > 0 ? "Crédito" : "Débito";
        await supabase
          .from('notifications')
          .insert({
            user_id: clientId, // This assumes notification is for the client's user
            title: `${operationName} em sua conta`,
            message: reason || `Um ${amount > 0 ? 'depósito' : 'saque'} de ${Math.abs(amount).toFixed(2)} foi ${amount > 0 ? 'adicionado à' : 'debitado da'} sua conta.`,
            type: 'BALANCE',
            data: {
              amount: amount,
              balance: newBalance
            }
          });
      } catch (notificationError) {
        console.warn("Could not send balance notification:", notificationError);
        // Don't throw here, the main operation succeeded
      }

      toast({
        title: "Saldo atualizado",
        description: `O saldo do cliente foi ${amount > 0 ? 'aumentado' : 'reduzido'} em R$ ${Math.abs(amount).toFixed(2)}.`
      });

      return true;
    } catch (error: any) {
      console.error("Error updating client balance:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar saldo",
        description: error.message || "Ocorreu um erro ao atualizar o saldo do cliente."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBalance,
    isLoading
  };
}
