import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest } from "@/types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { UsePaymentsOptions, PaymentData } from "./payment.types";
import { PaymentStatus } from "@/types";
import { toDBPaymentStatus } from "@/types/payment-status";

export const usePaymentsFetcher = (options: UsePaymentsOptions = {}) => {
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

      // Fix the error on line 32
      if (statusFilter !== "ALL") {
        const dbStatus = toDBPaymentStatus(statusFilter);
        if (dbStatus) {
          query = query.eq("status", dbStatus);
        }
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
          status: request.status,
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
  }, [statusFilter, searchTerm, fetchOnMount]);

  return {
    paymentRequests,
    setPaymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests
  };
};
