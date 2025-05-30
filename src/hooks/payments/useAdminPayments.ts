
import { useState, useEffect } from "react";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { PaymentRequest } from "@/types/payment.types";
import { paymentService } from "@/services/payment.service";
import { useToast } from "@/hooks/use-toast";

// Define the hook props
interface UseAdminPaymentsProps {
  searchTerm?: string;
  statusFilter?: PaymentStatus | "ALL";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export const useAdminPayments = ({
  searchTerm = '',
  statusFilter = "ALL",
  startDate,
  endDate,
  page = 1,
  pageSize = 20 // Changed default from 10 to 20
}: UseAdminPaymentsProps) => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allPayments = await paymentService.getPaymentRequests(startDate, endDate);
      
      // Apply filters
      let filteredPayments = allPayments;
      
      if (statusFilter && statusFilter !== "ALL") {
        filteredPayments = filteredPayments.filter(p => p.status === statusFilter);
      }
      
      if (searchTerm) {
        filteredPayments = filteredPayments.filter(p => 
          p.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
      
      setPayments(paginatedPayments);
      setTotalPages(Math.ceil(filteredPayments.length / pageSize));
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Erro ao carregar pagamentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [searchTerm, statusFilter, startDate, endDate, page, pageSize]);

  // Function to handle payment actions (approve, reject, etc.)
  const performPaymentAction = (paymentId: string, action: PaymentAction) => {
    switch (action) {
      case PaymentAction.APPROVE:
        toast({
          title: "Pagamento Aprovado",
          description: `Pagamento #${paymentId.substring(0, 8)} foi aprovado.`
        });
        break;
      case PaymentAction.REJECT:
        toast({
          title: "Pagamento Rejeitado",
          description: `Pagamento #${paymentId.substring(0, 8)} foi rejeitado.`
        });
        break;
      case PaymentAction.VIEW:
        toast({
          title: "Visualizando Pagamento",
          description: `Visualizando detalhes do pagamento #${paymentId.substring(0, 8)}.`
        });
        break;
      default:
        toast({
          variant: "destructive",
          title: "Ação Inválida",
          description: `A ação ${action} não é suportada.`
        });
    }
    
    // Refetch data after action
    setTimeout(fetchPayments, 1000);
  };

  return {
    payments,
    isLoading,
    error,
    totalPages,
    refetch: fetchPayments,
    performPaymentAction
  };
};

// Fix: Add a default export for backward compatibility
export default useAdminPayments;
