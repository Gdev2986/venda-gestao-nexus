
import { useCallback, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus, PaymentType } from "@/types";

// Define the payment interface
export interface PaymentData {
  id: string;
  amount: number;
  approved_at: string | null;
  approved_by: string | null;
  client_id: string;
  created_at: string;
  description: string;
  pix_key_id: string;
  receipt_url: string | null;
  status: PaymentStatus;
  updated_at: string;
  rejection_reason: string | null;
  pix_key: {
    id: string;
    key: string;
    type: string;
    name: string;
  };
  client: {
    id: string;
    business_name: string;
    email: string;
  };
}

interface UsePaymentsOptions {
  fetchOnMount?: boolean;
  statusFilter?: PaymentStatus | "ALL";
  searchTerm?: string;
  pageSize?: number;
}

export const usePayments = (options: UsePaymentsOptions = {}) => {
  const { 
    fetchOnMount = true, 
    statusFilter = "ALL", 
    searchTerm = "",
    pageSize = 10 
  } = options;
  
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('payment_requests')
        .select(`
          *,
          pix_key:pix_key_id (
            id,
            key,
            type,
            name
          ),
          client:client_id (
            id,
            business_name,
            email
          )
        `);
        
      // Apply status filter if it's not ALL
      if (statusFilter !== "ALL") {
        query = query.eq('status', statusFilter);
      }
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`
          client.business_name.ilike.%${searchTerm}%,
          description.ilike.%${searchTerm}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map data to our internal format
      const formattedData = (data || []).map((payment) => {
        return {
          ...payment,
          status: payment.status as PaymentStatus,
          rejection_reason: payment.rejection_reason || null,
          approved_at: payment.approved_at || null,
          approved_by: payment.approved_by || null,
          receipt_url: payment.receipt_url || null
        } as PaymentData;
      });
      
      setPayments(formattedData);
      // Calculate pagination
      setTotalPages(Math.ceil(formattedData.length / pageSize));
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar a lista de pagamentos."
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm, toast, pageSize]);

  // Fetch on mount if needed
  useEffect(() => {
    if (fetchOnMount) {
      fetchPayments();
    }
  }, [fetchPayments, fetchOnMount]);

  const approvePayment = useCallback(async (paymentId: string, receiptUrl?: string | null) => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: any = { 
        status: PaymentStatus.APPROVED,
        approved_at: new Date().toISOString(),
      };
      
      if (receiptUrl) {
        updateData.receipt_url = receiptUrl;
      }
      
      const { error } = await supabase
        .from('payment_requests')
        .update(updateData)
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso."
      });

      await fetchPayments(); // Refresh payments
      return true;
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar pagamento",
        description: "Não foi possível aprovar o pagamento."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchPayments]);

  const rejectPayment = useCallback(async (paymentId: string, rejectionReason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: PaymentStatus.REJECTED, 
          rejection_reason: rejectionReason 
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso."
      });

      await fetchPayments(); // Refresh payments
      return true;
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar pagamento",
        description: "Não foi possível rejeitar o pagamento."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchPayments]);

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    approvePayment,
    rejectPayment,
    currentPage,
    totalPages,
    setCurrentPage
  };
};
