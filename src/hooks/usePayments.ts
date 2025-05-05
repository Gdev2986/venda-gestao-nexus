
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UsePaymentsProps {
  statusFilter?: string;
  searchTerm?: string;
  pageSize?: number;
  initialPage?: number;
}

export const usePayments = ({
  statusFilter = "all",
  searchTerm = "",
  pageSize = 10,
  initialPage = 1
}: UsePaymentsProps = {}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { toast } = useToast();

  // Fetch payments based on filters
  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Build the query based on filters
      let query = supabase
        .from("payment_requests")
        .select(`
          *,
          pix_key: pix_key_id (key, type, name),
          client: client_id (business_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });
        
      // Apply status filter if selected
      if (statusFilter !== "all") {
        // Convert string to PaymentStatus enum to ensure type safety
        const statusValue = statusFilter.toUpperCase() as PaymentStatus;
        query = query.eq("status", statusValue);
      }
      
      // Apply search filter if present
      if (searchTerm) {
        query = query.or(`client.business_name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }
      
      // Paginate the results
      query = query
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
      
      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform the data to match our Payment type
      const transformedData = data.map(item => {
        // Define the payment type based on the data or use PIX as default
        let paymentType = PaymentType.PIX;

        return {
          id: item.id,
          amount: item.amount,
          status: item.status as PaymentStatus,
          created_at: item.created_at,
          updated_at: item.updated_at,
          client_id: item.client_id,
          description: item.description,
          approved_at: item.approved_at,
          receipt_url: item.receipt_url,
          client_name: item.client?.business_name || "Cliente desconhecido",
          payment_type: paymentType,
          rejection_reason: item.rejection_reason || null,
          pix_key: item.pix_key ? {
            id: item.pix_key_id,
            key: item.pix_key.key,
            type: item.pix_key.type,
            owner_name: item.pix_key.name
          } : undefined
        } as Payment;
      });

      setPayments(transformedData);
      
      if (count) {
        setTotalPages(Math.ceil(count / pageSize));
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch payments"));
      
      toast({
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar os pagamentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle payment approval
  const approvePayment = async (paymentId: string, receiptUrl?: string) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.APPROVED,
          approved_at: new Date().toISOString(),
          receipt_url: receiptUrl
        })
        .eq('id', paymentId);
        
      if (error) throw error;
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: "Não foi possível aprovar o pagamento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle payment rejection
  const rejectPayment = async (paymentId: string, rejectionReason: string) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.REJECTED,
          rejection_reason: rejectionReason
        })
        .eq('id', paymentId);
        
      if (error) throw error;
      
      toast({
        title: "Pagamento recusado",
        description: "O pagamento foi recusado com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Erro ao recusar pagamento",
        description: "Não foi possível recusar o pagamento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    fetchPayments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('payment_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPayments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter, searchTerm, currentPage, pageSize]);

  return {
    payments,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPayments,
    approvePayment,
    rejectPayment
  };
};
