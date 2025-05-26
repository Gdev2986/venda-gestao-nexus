import { useState, useEffect } from "react";
import { usePaymentsFetcher } from "./usePaymentsFetcher";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { useToast } from "@/hooks/use-toast";

// Define the hook props
interface UseAdminPaymentsProps {
  searchTerm?: string;
  statusFilter?: PaymentStatus | "ALL";
  page?: number;
  pageSize?: number;
}

export const useAdminPayments = ({
  searchTerm = '',
  statusFilter = "ALL",
  page = 1,
  pageSize = 10
}: UseAdminPaymentsProps) => {
  const { toast } = useToast();
  const {
    payments: paymentRequests,
    loading: isLoading,
    error,
    refetch: fetchPaymentRequests
  } = usePaymentsFetcher({
    status: statusFilter as any
  });

  // Function to handle payment actions (approve, reject, etc.)
  const performPaymentAction = (paymentId: string, action: PaymentAction) => {
    // In a real app, this would make an API call to perform the action
    
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
      case PaymentAction.DELETE:
        toast({
          title: "Pagamento Excluído",
          description: `Pagamento #${paymentId.substring(0, 8)} foi excluído.`
        });
        break;
      case PaymentAction.SEND_RECEIPT:
        toast({
          title: "Comprovante Enviado",
          description: `Comprovante para o pagamento #${paymentId.substring(0, 8)} foi enviado.`
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
    setTimeout(fetchPaymentRequests, 1000);
  };

  return {
    payments: paymentRequests,
    isLoading,
    error,
    totalPages: 1,
    refetch: fetchPaymentRequests,
    performPaymentAction
  };
};

// Fix: Add a default export for backward compatibility
export default useAdminPayments;
