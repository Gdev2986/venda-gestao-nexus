
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Payment, PaymentStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentAction } from '@/components/payments/PaymentTableColumns';

interface UseAdminPaymentsProps {
  searchTerm: string;
  statusFilter: PaymentStatus | 'ALL';
  page: number;
}

const PAGE_SIZE = 10;

export const useAdminPayments = ({ searchTerm, statusFilter, page }: UseAdminPaymentsProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPayments = async () => {
    let query = supabase
      .from('payment_requests')
      .select('*, client:clients(*)')
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (searchTerm) {
      query = query.ilike('id', `%${searchTerm}%`);
    }

    if (statusFilter !== 'ALL') {
      // Convert status to lowercase for database compatibility
      const dbStatus = statusFilter.toLowerCase();
      query = query.eq('status', dbStatus);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching payments:", error);
      throw new Error(error.message);
    }

    // Convert data with type assertion to ensure compatibility
    // Convert the database status (lowercase) back to the enum format (uppercase)
    const typedData = data.map(item => ({
      ...item,
      status: (item.status.toUpperCase() as PaymentStatus)
    })) as Payment[];

    return {
      data: typedData,
      totalCount: count || 0,
    };
  };

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminPayments', searchTerm, statusFilter, page],
    queryFn: fetchPayments
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

  const performPaymentAction = async (paymentId: string, action: PaymentAction, newStatus?: PaymentStatus) => {
    setActionLoading(paymentId);
    try {
      let updateData: any = {};

      if (action === PaymentAction.APPROVE) {
        updateData = { status: 'approved' };
      } else if (action === PaymentAction.REJECT) {
        updateData = { status: 'rejected' };
      } else if (newStatus) {
        // Convert to lowercase for database compatibility
        updateData = { status: newStatus.toLowerCase() };
      }

      const { error } = await supabase
        .from('payment_requests')
        .update(updateData)
        .eq('id', paymentId);

      if (error) {
        throw new Error(`Failed to ${action} payment: ${error.message}`);
      }

      toast({
        title: "Sucesso",
        description: `Pagamento ${action} com sucesso.`,
      });
      refetch();
    } catch (err: any) {
      console.error(`Error performing action ${action}:`, err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao ${action} pagamento: ${err.message}`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    payments: data?.data || [],
    isLoading,
    error,
    totalCount: data?.totalCount || 0,
    totalPages,
    refetch,
    actionLoading,
    performPaymentAction,
  };
};
