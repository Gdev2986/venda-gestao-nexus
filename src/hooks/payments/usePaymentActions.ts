
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequestStatus } from "@/types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { PaymentData } from "./payment.types";

export const usePaymentActions = (
  paymentRequests: PaymentData[],
  setPaymentRequests: React.Dispatch<React.SetStateAction<PaymentData[]>>
) => {
  const { toast } = useToast();

  const approvePayment = async (
    paymentId: string,
    receiptUrl?: string | null
  ): Promise<boolean> => {
    try {
      const updateData: any = {
        status: "APPROVED" as PaymentRequestStatus,
        approved_at: new Date().toISOString(),
      };
      
      if (receiptUrl) {
        updateData.receipt_url = receiptUrl;
      }
      
      const { error } = await supabase
        .from("payment_requests")
        .update(updateData)
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      // Update the local state
      setPaymentRequests(
        paymentRequests.map((request) =>
          request.id === paymentId
            ? { ...request, status: "APPROVED" as PaymentRequestStatus, receipt_url: receiptUrl || request.receipt_url }
            : request
        )
      );

      toast({
        title: "Payment Approved",
        description: "The payment has been successfully approved.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error approving payment",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectPayment = async (
    paymentId: string,
    rejectionReason: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({
          status: "REJECTED" as PaymentRequestStatus,
          rejection_reason: rejectionReason
        })
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      // Update the local state
      setPaymentRequests(
        paymentRequests.map((request) =>
          request.id === paymentId
            ? { 
                ...request, 
                status: "REJECTED" as PaymentRequestStatus,
                rejection_reason: rejectionReason 
              }
            : request
        )
      );

      toast({
        title: "Payment Rejected",
        description: "The payment has been rejected.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error rejecting payment",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    approvePayment,
    rejectPayment
  };
};
