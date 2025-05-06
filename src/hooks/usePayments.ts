import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchPaymentsData,
  approvePaymentRequest,
  rejectPaymentRequest,
  setupPaymentSubscription
} from "@/services/payment.service";
import { PaymentData } from "@/types/payment.types";
import { PaymentStatus } from "@/types";

interface UsePaymentsProps {
  statusFilter?: PaymentStatus | "ALL";
  searchTerm?: string;
  fetchOnMount?: boolean;
  pageSize?: number;
}

export const usePayments = (options: UsePaymentsProps = {}) => {
  const {
    statusFilter: initialStatusFilter = "ALL",
    searchTerm: initialSearchTerm = "",
    fetchOnMount = true,
    pageSize = 10
  } = options;

  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(initialStatusFilter);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPaymentsData(statusFilter, searchTerm);
      setPayments(data);
      
      // Calculate total pages
      setTotalPages(Math.ceil(data.length / pageSize));
      
      // Reset to first page when filters change
      if (currentPage > Math.ceil(data.length / pageSize)) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Não foi possível carregar os pagamentos.");
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Ocorreu um erro ao buscar os pagamentos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Approve payment handler
  const handleApprovePayment = async (paymentId: string, receiptUrl?: string) => {
    try {
      await approvePaymentRequest(paymentId, receiptUrl);
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      // Refresh payment list
      fetchPayments();
      
      return true;
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar pagamento",
        description: "Não foi possível aprovar o pagamento.",
      });
      return false;
    }
  };

  // Reject payment handler
  const handleRejectPayment = async (paymentId: string, reason: string) => {
    try {
      await rejectPaymentRequest(paymentId, reason);
      
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
      
      // Refresh payment list
      fetchPayments();
      
      return true;
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar pagamento",
        description: "Não foi possível rejeitar o pagamento.",
      });
      return false;
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchPayments();
    }

    // Set up real-time subscription
    const subscription = setupPaymentSubscription(() => {
      fetchPayments();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [statusFilter, searchTerm, fetchOnMount, toast]);

  return {
    payments,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    refreshPayments: fetchPayments,
    approvePayment: handleApprovePayment,
    rejectPayment: handleRejectPayment,
    currentPage,
    totalPages,
    setCurrentPage
  };
};

export type { PaymentData } from "@/types/payment.types";
