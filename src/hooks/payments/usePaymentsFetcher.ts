
import { useState, useEffect, useCallback } from "react";
import { PaymentStatus } from "@/types/enums";
import { toPaymentStatus } from "@/lib/type-utils";
import { useToast } from "@/hooks/use-toast";
import { PaymentRequest } from "@/types/payment.types";

// Function to filter payments by status
export const filterPaymentsByStatus = (payments: PaymentRequest[], statusFilter: PaymentStatus | 'ALL' | null) => {
  if (!statusFilter || statusFilter.toString().toLowerCase() === 'all') {
    return payments;
  }
  
  return payments.filter((payment) => {
    return payment.status === statusFilter;
  });
}

// Interface for the usePaymentsFetcher hook parameters
interface UsePaymentsFetcherParams {
  statusFilter?: PaymentStatus | 'ALL' | null;
  searchTerm?: string;
  fetchOnMount?: boolean;
  page?: number;
  pageSize?: number;
}

export const usePaymentsFetcher = ({
  statusFilter = null,
  searchTerm = '',
  fetchOnMount = true,
  page = 1,
  pageSize = 10
}: UsePaymentsFetcherParams = {}) => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Function to fetch payment requests from the API
  const fetchPaymentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock API call with setTimeout
      setTimeout(() => {
        // Generate some mock data
        const mockPayments: PaymentRequest[] = Array.from({ length: pageSize }, (_, i) => ({
          id: `payment-${(currentPage - 1) * pageSize + i + 1}`,
          client_id: `client-${i % 3 + 1}`,
          amount: Math.floor(Math.random() * 10000) / 100,
          status: Object.values(PaymentStatus)[i % 4] as any,
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          updated_at: new Date(Date.now() - i * 43200000).toISOString(),
          description: `Payment for service ${i + 1}`,
          rejection_reason: i % 4 === 3 ? 'Documentation incomplete' : null,
          client: {
            id: `client-${i % 3 + 1}`,
            business_name: `Client ${i % 3 + 1}`
          }
        }));

        // Filter by status if needed
        let filtered = mockPayments;
        if (statusFilter && statusFilter !== 'ALL') {
          const status = statusFilter as PaymentStatus;
          filtered = filterPaymentsByStatus(mockPayments, status);
        }

        // Filter by search term if provided
        if (searchTerm) {
          filtered = filtered.filter(
            (payment) =>
              payment.client?.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              payment.id.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setPaymentRequests(filtered);
        setTotalPages(3); // Mock pagination
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch payment data",
      });
    }
  }, [currentPage, pageSize, statusFilter, searchTerm, toast]);

  // Fetch data on mount if requested
  useEffect(() => {
    if (fetchOnMount) {
      fetchPaymentRequests();
    }
  }, [fetchOnMount, fetchPaymentRequests]);

  return {
    paymentRequests,
    setPaymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests,
  };
};

export default usePaymentsFetcher;
