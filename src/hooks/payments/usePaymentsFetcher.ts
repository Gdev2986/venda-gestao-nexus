import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus } from "@/types/payment.types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentRealtimeSubscription } from "./usePaymentRealtimeSubscription";

interface UsePaymentsFetcherProps {
  searchTerm?: string;
  statusFilter?: PaymentStatus | "ALL";
  page?: number;
  pageSize?: number;
  clientId?: string;
}

export const usePaymentsFetcher = ({
  searchTerm = '',
  statusFilter = 'ALL',
  page = 1,
  pageSize = 10,
  clientId
}: UsePaymentsFetcherProps = {}) => {
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  const fetchPaymentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('payment_requests')
        .select(`
          id, 
          amount,
          status,
          client_id,
          pix_key_id,
          created_at,
          updated_at,
          approved_at,
          approved_by,
          receipt_url,
          description,
          rejection_reason,
          client:clients!payment_requests_client_id_fkey (
            business_name, 
            email, 
            phone
          ),
          pix_key:pix_keys (
            id,
            key,
            type,
            name,
            user_id
          )
        `, { count: 'exact' });

      // Apply filters based on user role
      if (userRole === 'CLIENT') {
        // Get the client_id for the current user
        const { data: accessData } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user?.id)
          .single();
          
        if (accessData) {
          query = query.eq('client_id', accessData.client_id);
        }
      } else if (clientId) {
        // Filter by specific client if provided (for ADMIN, FINANCIAL)
        query = query.eq('client_id', clientId);
      }

      // Apply status filter
      if (statusFilter !== 'ALL') {
        // Fix for the type error by checking the exact type of statusFilter
        if (typeof statusFilter === 'string') {
          query = query.eq('status', statusFilter);
        } else {
          query = query.eq('status', statusFilter as PaymentStatus);
        }
      }

      // Apply search filter on client name
      if (searchTerm) {
        query = query.textSearch('client.business_name', searchTerm, {
          config: 'english',
          type: 'websearch'
        });
      }

      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Apply pagination
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw new Error(`Error fetching payment requests: ${fetchError.message}`);
      }

      // Transform the data to match our expected format
      const transformedPayments: Payment[] = data.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status as PaymentStatus,
        client_id: payment.client_id,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        approved_at: payment.approved_at,
        approved_by: payment.approved_by,
        receipt_url: payment.receipt_url,
        description: payment.description || '',
        rejection_reason: payment.rejection_reason,
        client_name: payment.client?.business_name,
        client: payment.client ? {
          id: payment.client_id,
          business_name: payment.client.business_name,
          email: payment.client.email,
          phone: payment.client.phone
        } : undefined,
        pix_key: payment.pix_key ? {
          id: payment.pix_key.id,
          key: payment.pix_key.key,
          type: payment.pix_key.type,
          name: payment.pix_key.name,
          owner_name: payment.pix_key.name, // Using name as owner_name
          user_id: payment.pix_key.user_id
        } : undefined
      }));

      setPaymentRequests(transformedPayments);
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }
      
    } catch (err: any) {
      console.error("Error fetching payment requests:", err);
      setError(err);
      toast({
        variant: "destructive",
        title: "Erro ao buscar pagamentos",
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole, statusFilter, searchTerm, currentPage, pageSize, clientId, toast]);

  // Set up initial data fetch
  useEffect(() => {
    fetchPaymentRequests();
  }, [fetchPaymentRequests]);

  // Set up real-time subscription
  usePaymentRealtimeSubscription(fetchPaymentRequests, {
    clientId: clientId,
    notifyOnUpdates: true
  });

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
