
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestStatus } from "@/types/payment.types";
import { useToast } from "./use-toast";
import { UserRole } from "@/types";

export function usePayments() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPaymentRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .select(`
          *,
          client:clients(id, business_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the PaymentRequest interface
        const formattedRequests = data.map((request: any) => ({
          id: request.id,
          client_id: request.client_id,
          client_name: request.client?.business_name || 'Unknown Client',
          amount: request.amount,
          description: request.description || '',
          status: request.status as PaymentRequestStatus,
          created_at: request.created_at,
          updated_at: request.updated_at,
          receipt_url: request.receipt_url || null,
          pix_key_id: request.pix_key_id
        }));

        setPaymentRequests(formattedRequests);
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error fetching payment requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentRequests();

    // Setup real-time subscription
    const subscription = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPaymentRequests();
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const approvePayment = async (
    paymentId: string,
    adminId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({
          status: "APPROVED",
          approved_by: adminId,
          approved_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      // Update the local state
      setPaymentRequests(
        paymentRequests.map((request) =>
          request.id === paymentId
            ? { ...request, status: "APPROVED" as PaymentRequestStatus }
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
    adminId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("payment_requests")
        .update({
          status: "REJECTED",
          approved_by: adminId,
        })
        .eq("id", paymentId);

      if (error) {
        throw error;
      }

      // Update the local state
      setPaymentRequests(
        paymentRequests.map((request) =>
          request.id === paymentId
            ? { ...request, status: "REJECTED" as PaymentRequestStatus }
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
    paymentRequests,
    isLoading,
    error,
    approvePayment,
    rejectPayment,
    refreshPayments: fetchPaymentRequests,
  };
}
