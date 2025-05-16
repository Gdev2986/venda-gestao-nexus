
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client, NotificationType } from "@/types";

interface UpdateClientBalanceOptions {
  clientId: string;
  amount: number;
  reason: string;
  type: "ADD" | "SUBTRACT";
}

export const useClientBalance = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateClientBalance = async ({ 
    clientId, 
    amount, 
    reason, 
    type 
  }: UpdateClientBalanceOptions): Promise<boolean> => {
    if (!clientId || amount <= 0) {
      toast({
        title: "Erro na atualização",
        description: "ID do cliente e valor são obrigatórios",
        variant: "destructive",
      });
      return false;
    }

    setIsUpdating(true);
    try {
      // Buscar o cliente para obter o saldo atual
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("balance, business_name, user_id")
        .eq("id", clientId)
        .single();

      if (clientError || !clientData) {
        throw new Error("Cliente não encontrado");
      }

      const currentBalance = clientData.balance || 0;
      const newBalance = type === "ADD" 
        ? currentBalance + amount 
        : Math.max(0, currentBalance - amount); // Evita saldo negativo

      // Atualizar saldo do cliente
      const { error: updateError } = await supabase
        .from("clients")
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq("id", clientId);

      if (updateError) {
        throw updateError;
      }

      // Registrar a alteração em um log
      await supabase.from("client_logs").insert({
        client_id: clientId,
        previous_value: { balance: currentBalance },
        new_value: { balance: newBalance },
        changed_by: (await supabase.auth.getUser()).data.user?.id,
        action_type: type === "ADD" ? "BALANCE_INCREASE" : "BALANCE_DECREASE"
      });

      // Criar uma notificação para o cliente
      const notificationMessage = type === "ADD"
        ? `Seu saldo foi aumentado em R$ ${amount.toFixed(2)}`
        : `Seu saldo foi reduzido em R$ ${amount.toFixed(2)}`;

      if (clientData.user_id) {
        await supabase.from("notifications").insert({
          user_id: clientData.user_id,
          title: "Alteração de Saldo",
          message: notificationMessage + (reason ? `: "${reason}"` : ""),
          type: NotificationType.BALANCE,
          data: {
            previous_balance: currentBalance,
            new_balance: newBalance,
            amount: amount,
            type: type,
            reason: reason || null,
            timestamp: new Date().toISOString()
          }
        });
      }

      toast({
        title: "Saldo atualizado",
        description: `Saldo do cliente ${clientData.business_name} foi atualizado com sucesso.`,
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar saldo:", error);
      toast({
        title: "Erro",
        description: `Falha ao atualizar saldo: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchClientBalance = async (clientId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("balance")
        .eq("id", clientId)
        .single();

      if (error) throw error;
      return data?.balance || 0;
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
      return 0;
    }
  };

  return {
    updateClientBalance,
    fetchClientBalance,
    isUpdating
  };
};
