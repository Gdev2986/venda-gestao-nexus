
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentStatus } from '@/types/payment.types';

interface UsePaymentsFetcherProps {
  status?: PaymentStatus | "ALL";
  enableRealtime?: boolean;
  initialFetch?: boolean;
}

export const usePaymentsFetcher = ({ status = "ALL", enableRealtime = false, initialFetch = true }: UsePaymentsFetcherProps = {}) => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPaymentRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('payment_requests')
        .select(`
          *,
          client:clients(id, business_name)
        `);

      if (status !== "ALL" && status in PaymentStatus) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPayments: PaymentRequest[] = data?.map(payment => ({
        id: payment.id,
        client_id: payment.client_id,
        amount: payment.amount,
        status: payment.status as PaymentStatus,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        description: payment.description || '',
        rejection_reason: payment.rejection_reason || '',
        client: payment.client,
        pix_key_id: payment.pix_key_id,
        method: 'PIX' as any,
        requested_at: payment.created_at
      })) || [];

      setPaymentRequests(formattedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchPaymentRequests();
    }
  }, [status, initialFetch]);

  return { 
    paymentRequests,
    setPaymentRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPaymentRequests
  };
};

export default usePaymentsFetcher;
