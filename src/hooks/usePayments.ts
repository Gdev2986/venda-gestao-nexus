
import { useCallback, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchPaymentsData, 
  approvePaymentRequest, 
  rejectPaymentRequest, 
  setupPaymentSubscription 
} from "@/services/payment.service";
import { 
  PaymentData, 
  UsePaymentsOptions, 
  UsePaymentsResult 
} from "@/types/payment.types";
import { supabase } from "@/integrations/supabase/client";

export type { PaymentData } from "@/types/payment.types";

export const usePayments = (options: UsePaymentsOptions = {}): UsePaymentsResult => {
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
      const data = await fetchPaymentsData(statusFilter, searchTerm);
      
      setPayments(data);
      // Calculate pagination
      setTotalPages(Math.ceil(data.length / pageSize));
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

  // Set up real-time subscription for payment changes
  useEffect(() => {
    const channel = setupPaymentSubscription(fetchPayments);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPayments]);

  const approvePayment = useCallback(async (paymentId: string, receiptUrl?: string | null) => {
    setIsLoading(true);
    setError(null);

    try {
      await approvePaymentRequest(paymentId, receiptUrl);
      
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
      await rejectPaymentRequest(paymentId, rejectionReason);
      
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
