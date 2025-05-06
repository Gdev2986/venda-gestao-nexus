
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

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPaymentsData(statusFilter, searchTerm);
      setPayments(data);
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
    fetchPayments();

    // Set up real-time subscription
    const subscription = setupPaymentSubscription(() => {
      fetchPayments();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [statusFilter, searchTerm, toast]);

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
  };
};
