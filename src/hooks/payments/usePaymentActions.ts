
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PaymentData } from "./payment.types";

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
          status: "APPROVED",
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
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? {
                ...payment,
                status: "APPROVED",
                approved_at: new Date().toISOString(),
                approved_by: "current-user-id", // Should be replaced with actual user ID
                receipt_url: receiptUrl,
              }
            : payment
        )
      );

      toast({
        title: "Payment Approved",
        description: "The payment request has been approved successfully.",
      });

      return true;
    } catch (error: any) {
      console.error("Error approving payment:", error);
      toast({
        variant: "destructive",
        title: "Approval Failed",
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
          status: "REJECTED",
          rejection_reason: rejectionReason,
        })
        .eq("id", paymentId);

      if (error) {
        throw new Error(`Payment rejection failed: ${error.message}`);
      }

      // Update local state
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? {
                ...payment,
                status: "REJECTED",
                rejection_reason: rejectionReason,
              }
            : payment
        )
      );

      toast({
        title: "Payment Rejected",
        description: "The payment request has been rejected.",
      });

      return true;
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Rejection Failed",
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
    isProcessing,
    processingIds,
  };
};
