
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentStatus, PaymentMethod } from '@/types/payment.types';

interface UsePaymentsFetcherProps {
  status?: PaymentStatus | "ALL";
}

export const usePaymentsFetcher = ({ status = "ALL" }: UsePaymentsFetcherProps = {}) => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('payment_requests')
        .select(`
          *,
          client:clients(id, business_name)
        `);

      if (status !== "ALL") {
        // Use exact string values that match the database enum
        const dbStatus = status === PaymentStatus.PENDING ? "PENDING" : 
                        status === PaymentStatus.PROCESSING ? "PROCESSING" :
                        status === PaymentStatus.APPROVED ? "APPROVED" :
                        status === PaymentStatus.PAID ? "PAID" :
                        status === PaymentStatus.REJECTED ? "REJECTED" : "PENDING";
        query = query.eq('status', dbStatus);
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
        method: PaymentMethod.PIX,
        requested_at: payment.created_at,
        approved_at: payment.approved_at,
        approved_by: payment.approved_by,
        receipt_url: payment.receipt_url
      })) || [];

      setPayments(formattedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [status]);

  return { payments, loading, error, refetch: fetchPayments };
};
