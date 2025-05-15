
import { useState, useEffect, useCallback } from 'react';
import { PaymentRequest, PaymentRequestStatus } from './payment.types';
import { useToast } from '@/hooks/use-toast';

// Mock payment data - simulating what would come from the API
const mockPaymentRequests: PaymentRequest[] = [
  {
    id: '1',
    client_id: 'client1',
    amount: 1000,
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rejection_reason: null
  },
  {
    id: '2',
    client_id: 'client2',
    amount: 2500,
    status: 'APPROVED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rejection_reason: null
  }
];

export const usePaymentsFetcher = (clientId?: string, statusFilter: PaymentRequestStatus | 'ALL' = 'ALL') => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Convert string status to the proper type
  const normalizeStatus = (status: string): PaymentRequestStatus => {
    const upperStatus = status.toUpperCase();
    if (['PENDING', 'APPROVED', 'PAID', 'REJECTED'].includes(upperStatus)) {
      return upperStatus as PaymentRequestStatus;
    }
    return 'PENDING';
  };

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // For now, we'll just use the mock data
      let filteredPayments = [...mockPaymentRequests];
      
      // Filter by client if provided
      if (clientId) {
        filteredPayments = filteredPayments.filter(p => p.client_id === clientId);
      }
      
      // Filter by status if not 'ALL'
      if (statusFilter !== 'ALL') {
        const normalizedStatus = normalizeStatus(statusFilter as string);
        filteredPayments = filteredPayments.filter(
          p => p.status.toUpperCase() === normalizedStatus
        );
      }
      
      setPayments(filteredPayments);
    } catch (err: any) {
      console.error('Error fetching payment requests:', err);
      setError(err.message || 'An error occurred while fetching payment requests');
      
      toast({
        title: 'Error',
        description: 'Failed to load payment requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, statusFilter, toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments
  };
};
