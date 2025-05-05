
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface FilterOptions {
  searchTerm?: string;
  statusFilter?: string;
  status?: PaymentStatus | "ALL";
  dateRange?: { from: Date; to?: Date };
}

export function usePayments(options?: {
  statusFilter?: string;
  searchTerm?: string;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Set initial filter options from props
  useEffect(() => {
    if (options) {
      setFilterOptions({
        searchTerm: options.searchTerm,
        statusFilter: options.statusFilter
      });
    }
  }, [options?.searchTerm, options?.statusFilter]);

  // Function to fetch payments from Supabase
  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("payment_requests")
        .select(`
          *,
          client: client_id (business_name)
        `, { count: 'exact' })
        .order("created_at", { ascending: false });

      // Apply filters
      if (filterOptions.searchTerm) {
        query = query.or(`client.business_name.ilike.%${filterOptions.searchTerm}%,id.ilike.%${filterOptions.searchTerm}%`);
      }

      if (filterOptions.statusFilter && filterOptions.statusFilter !== "all") {
        // Fix: Convert string to PaymentStatus enum if valid
        const statusValue = filterOptions.statusFilter.toUpperCase();
        if (Object.values(PaymentStatus).includes(statusValue as PaymentStatus)) {
          query = query.eq("status", statusValue);
        }
      }

      if (filterOptions.dateRange?.from) {
        const fromDate = filterOptions.dateRange.from.toISOString().split('T')[0];
        query = query.gte("created_at", fromDate);
      }

      if (filterOptions.dateRange?.to) {
        const toDate = filterOptions.dateRange.to.toISOString().split('T')[0];
        query = query.lte("created_at", toDate);
      }

      // Add pagination
      const pageSize = 10;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Transform the data to match our Payment type
        const transformedPayments = data.map(transformPaymentData);
        setPayments(transformedPayments);
        
        // Calculate total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / pageSize));
        }
      } else {
        setPayments([]);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar pagamentos",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterOptions, currentPage]);

  // Function to update filter options
  const updateFilterOptions = (newOptions: FilterOptions) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Approve payment function
  const approvePayment = async (paymentId: string, receiptUrl: string | null) => {
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
        description: "O pagamento foi aprovado com sucesso."
      });
      
      // Refresh payments list
      fetchPayments();
      
      return true;
    } catch (error: any) {
      console.error("Error approving payment:", error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Reject payment function
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
        description: "O pagamento foi recusado com sucesso."
      });
      
      // Refresh payments list
      fetchPayments();
      
      return true;
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Erro ao recusar pagamento",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Transform raw database records to Payment objects
  const transformPaymentData = (data: any): Payment => {
    return {
      id: data.id,
      amount: data.amount,
      status: data.status as PaymentStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client_id: data.client_id,
      approved_at: data.approved_at,
      receipt_url: data.receipt_url,
      client_name: data.client?.business_name || "Cliente desconhecido",
      payment_type: data.payment_type || PaymentType.PIX,
      rejection_reason: data.rejection_reason || null,
      bank_info: data.bank_info,
      document_url: data.document_url
    };
  };

  return {
    payments,
    isLoading,
    error,
    updateFilterOptions,
    fetchPayments,
    currentPage,
    totalPages,
    setCurrentPage,
    approvePayment,
    rejectPayment,
    loading: isLoading // Alias for backward compatibility
  };
}
