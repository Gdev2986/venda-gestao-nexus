
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentRequest, PaymentRequestStatus } from './payment.types';

// Mock payments data
const MOCK_PAYMENTS: PaymentRequest[] = [
  {
    id: '1',
    client_id: 'client-1',
    amount: 150000,
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rejection_reason: null,
    client: {
      business_name: 'Comércio ABC',
      id: 'client-1'
    }
  },
  {
    id: '2',
    client_id: 'client-2',
    amount: 75000,
    status: 'APPROVED',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    rejection_reason: null,
    client: {
      business_name: 'Loja XYZ',
      id: 'client-2'
    }
  }
];

export function useAdminPayments(statusFilter: PaymentRequestStatus | 'ALL' = 'ALL') {
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
      // For now we'll just filter the mock data
      let filteredPayments = [...MOCK_PAYMENTS];
      
      if (statusFilter !== 'ALL') {
        const normalizedStatus = normalizeStatus(statusFilter as string);
        filteredPayments = filteredPayments.filter(
          payment => payment.status.toUpperCase() === normalizedStatus
        );
      }
      
      setPayments(filteredPayments);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load payments';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments
  };
}
