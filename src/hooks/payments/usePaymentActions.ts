
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentAction, PaymentStatus } from "@/types/enums";
import { NotificationType } from "@/types";

export const usePaymentActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePaymentAction = async (
    paymentId: string,
    action: PaymentAction,
    comment?: string
  ) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para realizar esta ação",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Get payment details first to check its current state
      const { data: paymentData, error: fetchError } = await supabase
        .from("payment_requests")
        .select("status, client_id")
        .eq("id", paymentId)
        .single();
      
      if (fetchError) {
        throw new Error(`Erro ao buscar detalhes do pagamento: ${fetchError.message}`);
      }

      // Update the payment status based on the action
      if (action === PaymentAction.APPROVE) {
        // Don't approve if already approved
        if (paymentData.status === 'APPROVED') {
          toast({
            title: "Aviso",
            description: "Este pagamento já foi aprovado anteriormente",
          });
          return false;
        }

        const { error: updateError } = await supabase
          .from("payment_requests")
          .update({ 
            status: "APPROVED", // Use string literal instead of enum
            approved_at: new Date().toISOString(),
            approved_by: user.id
          })
          .eq("id", paymentId);

        if (updateError) {
          throw new Error(`Erro ao aprovar pagamento: ${updateError.message}`);
        }

        // Notify the client about approval
        await supabase
          .from("notifications")
          .insert({
            user_id: user.id, // This should be the client user ID in a real implementation
            title: "Pagamento Aprovado",
            message: "Seu pagamento foi aprovado com sucesso",
            type: "PAYMENT" as NotificationType, // Use existing valid notification type
            data: { payment_id: paymentId, status: "APPROVED" }
          });

        toast({
          title: "Pagamento aprovado",
          description: "O pagamento foi aprovado com sucesso",
        });
      } else if (action === PaymentAction.REJECT) {
        // Don't reject if already rejected
        if (paymentData.status === 'REJECTED') {
          toast({
            title: "Aviso",
            description: "Este pagamento já foi rejeitado anteriormente",
          });
          return false;
        }

        const { error: updateError } = await supabase
          .from("payment_requests")
          .update({ 
            status: "REJECTED", // Use string literal instead of enum
            rejection_reason: comment || null
          })
          .eq("id", paymentId);

        if (updateError) {
          throw new Error(`Erro ao rejeitar pagamento: ${updateError.message}`);
        }

        // Notify the client about rejection
        await supabase
          .from("notifications")
          .insert({
            user_id: user.id, // This should be the client user ID in a real implementation
            title: "Pagamento Rejeitado",
            message: comment || "Seu pagamento foi rejeitado",
            type: "PAYMENT" as NotificationType, // Use existing valid notification type
            data: { payment_id: paymentId, status: "REJECTED", reason: comment }
          });

        toast({
          title: "Pagamento rejeitado",
          description: "O pagamento foi rejeitado",
        });
      } else if (action === PaymentAction.DELETE) {
        const { error: deleteError } = await supabase
          .from("payment_requests")
          .delete()
          .eq("id", paymentId);

        if (deleteError) {
          throw new Error(`Erro ao excluir pagamento: ${deleteError.message}`);
        }

        toast({
          title: "Pagamento excluído",
          description: "O pagamento foi excluído com sucesso",
        });
      } else if (action === PaymentAction.SEND_RECEIPT) {
        // In a real app, here you would handle uploading receipt or sending receipt
        const { error: updateError } = await supabase
          .from("payment_requests")
          .update({ 
            status: "PAID" // Use string literal instead of enum
          })
          .eq("id", paymentId);

        if (updateError) {
          throw new Error(`Erro ao atualizar pagamento: ${updateError.message}`);
        }

        // Notify the client about payment confirmation
        await supabase
          .from("notifications")
          .insert({
            user_id: user.id, // This should be the client user ID in a real implementation
            title: "Comprovante Enviado",
            message: "O comprovante do seu pagamento foi enviado",
            type: "PAYMENT" as NotificationType, // Use existing valid notification type
            data: { payment_id: paymentId, status: "PAID" }
          });

        toast({
          title: "Comprovante enviado",
          description: "O comprovante foi enviado com sucesso",
        });
      }

      return true;
    } catch (error: any) {
      console.error("Error handling payment action:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar a ação",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approvePayment = async (paymentId: string, comment?: string) => {
    return handlePaymentAction(paymentId, PaymentAction.APPROVE, comment);
  };

  const rejectPayment = async (paymentId: string, comment?: string) => {
    return handlePaymentAction(paymentId, PaymentAction.REJECT, comment);
  };

  const deletePayment = async (paymentId: string) => {
    return handlePaymentAction(paymentId, PaymentAction.DELETE);
  };

  const viewPayment = async (paymentId: string) => {
    return handlePaymentAction(paymentId, PaymentAction.VIEW);
  };

  const sendReceipt = async (paymentId: string) => {
    return handlePaymentAction(paymentId, PaymentAction.SEND_RECEIPT);
  };

  return {
    isLoading,
    approvePayment,
    rejectPayment,
    deletePayment,
    viewPayment,
    sendReceipt,
  };
};
