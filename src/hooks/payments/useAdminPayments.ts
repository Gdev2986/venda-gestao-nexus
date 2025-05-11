import { useState, useEffect } from "react";
import { PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseAdminPaymentsProps {
  searchTerm?: string;
  statusFilter?: PaymentStatus | 'ALL';
  page?: number;
}

export type PaymentAction = 'APPROVE' | 'REJECT';

const itemsPerPage = 10;

export const useAdminPayments = ({ 
  searchTerm = '', 
  statusFilter = 'ALL', 
  page = 1
}: UseAdminPaymentsProps) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, [searchTerm, statusFilter, page]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('payment_requests')
        .select('*', { count: 'exact' });
      
      // Apply filters if provided
      if (searchTerm) {
        query = query.or(`client_id.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter !== 'ALL') {
        // Use type casting to avoid type errors
        query = query.eq('status', statusFilter as PaymentStatus);
      }
      
      // Apply pagination
      const startRange = (page - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startRange, endRange);
      
      if (error) throw error;
      
      // Calculate total pages
      const total = count ? Math.ceil(count / itemsPerPage) : 0;
      setTotalPages(total);
      
      setPayments(data || []);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: error.message || "Não foi possível carregar a lista de pagamentos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performPaymentAction = async (paymentId: string, action: PaymentAction) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: `Pagamento ${action === 'APPROVE' ? 'aprovado' : 'rejeitado'}`,
        description: `O pagamento foi ${action === 'APPROVE' ? 'aprovado' : 'rejeitado'} com sucesso.`
      });

      refetch(); // Refresh the payments list
    } catch (error: any) {
      console.error("Error performing payment action:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível ${action === 'APPROVE' ? 'aprovar' : 'rejeitar'} o pagamento. ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchPayments();
  };

  return {
    payments,
    isLoading,
    totalPages,
    refetch,
    performPaymentAction,
  };
};
