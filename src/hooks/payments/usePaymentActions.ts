import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface PaymentActionHook {
  approvePayment: (paymentId: string) => Promise<boolean>;
  rejectPayment: (paymentId: string) => Promise<boolean>;
  isApproving: boolean;
  isRejecting: boolean;
}

export const usePaymentActions = (): PaymentActionHook => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { user } = useAuth();

  const approvePayment = async (paymentId: string): Promise<boolean> => {
    setIsApproving(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("payment_requests")
        .update({ status: 'approved', approved_by: user.id })
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Pagamento Aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao Aprovar",
        description: error.message || "Não foi possível aprovar o pagamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const rejectPayment = async (paymentId: string): Promise<boolean> => {
    setIsRejecting(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("payment_requests")
        .update({ status: 'rejected', rejected_by: user.id })
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Pagamento Rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao Rejeitar",
        description: error.message || "Não foi possível rejeitar o pagamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsRejecting(false);
    }
  };

  return {
    approvePayment,
    rejectPayment,
    isApproving,
    isRejecting,
  };
};
