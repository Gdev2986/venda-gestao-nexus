
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PaymentAction, PaymentStatus } from "@/types/enums";

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
      // Update the payment status based on the action
      if (action === PaymentAction.APPROVE) {
        const { error: updateError } = await supabase
          .from("payment_requests")
          .update({ 
            status: "APPROVED",
            approved_at: new Date().toISOString(),
            approved_by: user.id
          })
          .eq("id", paymentId);

        if (updateError) {
          throw new Error(`Erro ao aprovar pagamento: ${updateError.message}`);
        }

        toast({
          title: "Pagamento aprovado",
          description: "O pagamento foi aprovado com sucesso",
        });
      } else if (action === PaymentAction.REJECT) {
        const { error: updateError } = await supabase
          .from("payment_requests")
          .update({ 
            status: "REJECTED",
            rejection_reason: comment || null
          })
          .eq("id", paymentId);

        if (updateError) {
          throw new Error(`Erro ao rejeitar pagamento: ${updateError.message}`);
        }

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
