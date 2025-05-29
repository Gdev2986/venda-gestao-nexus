
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface PaymentActionHook {
  approvePayment: (id: string) => Promise<void>;
  rejectPayment: (id: string) => Promise<void>;
  isLoading: boolean;
  deletePayment: (id: string) => Promise<void>;
  sendReceipt: (id: string, file: File) => Promise<void>;
}

export const usePaymentActions = (): PaymentActionHook => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const approvePayment = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({ status: "APPROVED" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pagamento aprovado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectPayment = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({ status: "REJECTED" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pagamento rejeitado",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("payment_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pagamento excluído",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendReceipt = async (id: string, file: File) => {
    setIsLoading(true);
    try {
      // Simulate receipt upload - in real implementation, upload to storage
      console.log("Uploading receipt for payment:", id, file.name);
      
      toast({
        title: "Sucesso",
        description: "Comprovante enviado",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    approvePayment,
    rejectPayment,
    deletePayment,
    sendReceipt,
    isLoading,
  };
};
