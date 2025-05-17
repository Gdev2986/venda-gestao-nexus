import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PaymentData } from "@/types/payment.types";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentActions = (
  payments: PaymentData[],
  setPayments: React.Dispatch<React.SetStateAction<PaymentData[]>>
) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { toast } = useToast();

  const isProcessing = (id: string) => processingIds.includes(id);

  const approvePayment = async (
    paymentId: string,
    receiptFile: File | null,
    notes?: string
  ) => {
    setProcessingIds((prev) => [...prev, paymentId]);

    try {
      // 1. Upload receipt if provided
      let receiptUrl = null;
      if (receiptFile) {
        const fileName = `receipts/${paymentId}/${Date.now()}-${receiptFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-receipts")
          .upload(fileName, receiptFile);

        if (uploadError) {
          throw new Error(`Receipt upload failed: ${uploadError.message}`);
        }

        // Get the public URL for the uploaded receipt
        const { data } = supabase.storage
          .from("payment-receipts")
          .getPublicUrl(fileName);
          
        receiptUrl = data.publicUrl;
      }

      // 2. Update payment status to APPROVED
      const { error: updateError } = await supabase
        .from("payment_requests")
        .update({
          status: "APPROVED", // Use string literal to match database enum
          approved_at: new Date().toISOString(),
          approved_by: "current-user-id", // Should be replaced with actual user ID
          receipt_url: receiptUrl,
          ...(notes ? { notes } : {}),
        })
        .eq("id", paymentId);

      if (updateError) {
        throw new Error(`Payment approval failed: ${updateError.message}`);
      }

      // 3. Update local state
      setPayments((prevPayments) =>
        prevPayments.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              status: "APPROVED" as any,
              approved_at: new Date().toISOString(),
              approved_by: "current-user-id", // Should be replaced with actual user ID
              receipt_url: receiptUrl,
            };
          }
          return payment;
        })
      );

      toast({
        title: "Pagamento Aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao aprovar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Falha na Aprovação",
        description: error.message,
      });
      return false;
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== paymentId));
    }
  };

  const rejectPayment = async (paymentId: string, rejectionReason: string) => {
    setProcessingIds((prev) => [...prev, paymentId]);

    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({
          status: "REJECTED", // Use string literal to match database enum
          rejection_reason: rejectionReason,
        })
        .eq("id", paymentId);

      if (error) {
        throw new Error(`Payment rejection failed: ${error.message}`);
      }

      // Update local state
      setPayments((prevPayments) =>
        prevPayments.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              status: "REJECTED" as any,
              rejection_reason: rejectionReason,
            };
          }
          return payment;
        })
      );

      toast({
        title: "Pagamento Rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao rejeitar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Falha na Rejeição",
        description: error.message,
      });
      return false;
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== paymentId));
    }
  };

  const sendReceipt = async (paymentId: string, receiptFile: File, message?: string) => {
    setProcessingIds((prev) => [...prev, paymentId]);

    try {
      // Upload receipt
      const fileName = `receipts/${paymentId}/${Date.now()}-${receiptFile.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(fileName, receiptFile);

      if (uploadError) {
        throw new Error(`Receipt upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded receipt
      const { data } = supabase.storage
        .from("payment-receipts")
        .getPublicUrl(fileName);
        
      const receiptUrl = data.publicUrl;

      // Update payment with receipt URL
      const { error: updateError } = await supabase
        .from("payment_requests")
        .update({
          receipt_url: receiptUrl,
          status: "PAID" as any, // Explicit cast
        })
        .eq("id", paymentId);

      if (updateError) {
        throw new Error(`Receipt update failed: ${updateError.message}`);
      }

      // Update local state
      setPayments((prevPayments) =>
        prevPayments.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              receipt_url: receiptUrl,
              status: "PAID" as any,
            };
          }
          return payment;
        })
      );

      toast({
        title: "Comprovante Enviado",
        description: "O comprovante foi enviado com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao enviar comprovante:", error);
      toast({
        variant: "destructive",
        title: "Falha no Envio",
        description: error.message,
      });
      return false;
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== paymentId));
    }
  };

  return {
    approvePayment,
    rejectPayment,
    sendReceipt,
    isProcessing,
    processingIds,
  };
};
