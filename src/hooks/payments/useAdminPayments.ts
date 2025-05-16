
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from "@/types";
import { toPaymentStatus } from "@/lib/type-utils";
import { filterPaymentsByStatus } from "./usePaymentsFetcher";

// Interface for the useAdminPayments hook parameters
interface UseAdminPaymentsParams {
  searchTerm: string;
  statusFilter: PaymentStatus | 'ALL';
  page: number;
}

// Define the PaymentAction enum if it's not already defined elsewhere
export enum PaymentAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  DELETE = 'delete',
  UPLOAD_RECEIPT = 'upload_receipt',
  VIEW = 'view', // Adding VIEW action to match components/payments/PaymentTableColumns
}

export const useAdminPayments = ({ 
  searchTerm, 
  statusFilter, 
  page 
}: UseAdminPaymentsParams) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();

  // Convert string status to enum value for type safety when filtering
  const filterStatus = statusFilter === 'ALL' ? null : statusFilter;
  const filteredPayments = filterPaymentsByStatus(payments, filterStatus);

  // Mock function to fetch payments - in a real app this would call an API
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        const mockedPayments = [
          {
            id: '1',
            client_name: 'ABC Company',
            amount: 1000,
            status: PaymentStatus.PENDING,
            created_at: new Date().toISOString(),
            client_id: 'client-1',
          },
          {
            id: '2',
            client_name: 'XYZ Corporation',
            amount: 2500,
            status: PaymentStatus.APPROVED,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            client_id: 'client-2',
          },
          {
            id: '3',
            client_name: 'DEF Industries',
            amount: 750,
            status: PaymentStatus.REJECTED,
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            client_id: 'client-3',
            rejection_reason: 'Insufficient information provided'
          },
        ];

        setPayments(mockedPayments);
        setTotalPages(1);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch payment data",
      });
      setIsLoading(false);
    }
  }, [toast]);

  // Function to refetch payments (e.g. after taking an action)
  const refetch = useCallback(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Function to handle payment actions (approve, reject, delete)
  const performPaymentAction = useCallback((paymentId: string, action: PaymentAction) => {
    try {
      // In a real app, this would call an API endpoint
      const updatedPayments = payments.map(payment => {
        if (payment.id === paymentId) {
          switch (action) {
            case PaymentAction.APPROVE:
              return { ...payment, status: PaymentStatus.APPROVED };
            case PaymentAction.REJECT:
              return { ...payment, status: PaymentStatus.REJECTED };
            default:
              return payment;
          }
        }
        return payment;
      });

      // For delete action, remove the payment from the list
      if (action === PaymentAction.DELETE) {
        const filteredPayments = payments.filter(payment => payment.id !== paymentId);
        setPayments(filteredPayments);
      } else {
        setPayments(updatedPayments);
      }

      // Show toast notification
      const actionText = action === PaymentAction.APPROVE ? 'approved' : 
                         action === PaymentAction.REJECT ? 'rejected' : 
                         action === PaymentAction.DELETE ? 'deleted' : 
                         action === PaymentAction.VIEW ? 'viewed' : 
                         action === PaymentAction.UPLOAD_RECEIPT ? 'receipt uploaded' : 'processed';
      
      toast({
        title: `Payment ${actionText}`,
        description: `The payment was successfully ${actionText}.`,
      });

    } catch (error) {
      console.error(`Error performing ${action} on payment:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} the payment.`,
      });
    }
  }, [payments, toast]);

  // Use useEffect to load payments initially
  useState(() => {
    fetchPayments();
  });

  return {
    payments: filteredPayments,
    isLoading,
    totalPages,
    refetch,
    performPaymentAction,
  };
};

export default useAdminPayments;
