
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestStatus } from "@/types/payment.types";
import { useToast } from "./use-toast";
import { UserRole } from "@/types";

// Export the PaymentData type that's being referenced in other files
export type PaymentData = PaymentRequest;

interface UsePaymentsOptions {
  statusFilter?: PaymentRequestStatus | "ALL";
  searchTerm?: string;
  fetchOnMount?: boolean;
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { statusFilter = "ALL", searchTerm = "", fetchOnMount = true } = options;

  const fetchPaymentRequests = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("payment_requests")
        .select(`
          *,
          client:clients(id, business_name, email)
        `);

      // Apply status filter if not ALL
      if (statusFilter !== "ALL") {
        query = query.eq("status", statusFilter);
      }

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`client.business_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the PaymentRequest interface
        const formattedRequests: PaymentRequest[] = data.map((request: any) => ({
          id: request.id,
          client_id: request.client_id,
          client_name: request.client?.business_name || 'Unknown Client',
          amount: request.amount,
          description: request.description || '',
          status: request.status as PaymentRequestStatus,
          created_at: request.created_at,
          updated_at: request.updated_at,
          receipt_url: request.receipt_url || null,
          pix_key_id: request.pix_key_id,
          approved_at: request.approved_at || null,
          approved_by: request.approved_by || null,
          rejection_reason: request.rejection_reason || null,
          client: request.client
        }));

        setPaymentRequests(formattedRequests);
        
        // Mock pagination for now
        setTotalPages(Math.ceil(formattedRequests.length / 10));
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
    if (fetchOnMount) {
      fetchPaymentRequests();
    }

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
  }, [statusFilter, searchTerm, fetchOnMount]);

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
    paymentRequests,
    isLoading,
    error,
    approvePayment,
    rejectPayment,
    refreshPayments: fetchPaymentRequests,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
