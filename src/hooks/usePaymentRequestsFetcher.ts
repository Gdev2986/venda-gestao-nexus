
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PaymentStatus } from "@/types/enums";

interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  pix_key_id: string;
  description: string;
  receipt_url: string;
  rejection_reason: string;
  approved_at: string;
  approved_by: string;
}

interface FetchPaymentRequestsOptions {
  notifyUser?: boolean;
  filterByClientId?: string;
}

export function usePaymentRequestsFetcher() {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentRequests = useCallback(async (options: FetchPaymentRequestsOptions = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.filterByClientId) {
        query = query.eq('client_id', options.filterByClientId);
      } else if (user?.id) {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching payment requests:", error);
        setError(`Failed to fetch payment requests: ${error.message}`);
        if (options.notifyUser) {
          toast({
            title: "Erro",
            description: `Failed to fetch payment requests: ${error.message}`,
            variant: "destructive",
          });
        }
        return;
      }

      const formattedData: PaymentRequest[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        amount: item.amount,
        status: item.status as PaymentStatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        pix_key_id: item.pix_key_id,
        description: item.description || '',
        receipt_url: item.receipt_url || '',
        rejection_reason: item.rejection_reason || '',
        approved_at: item.approved_at || '',
        approved_by: item.approved_by || ''
      }));

      setPaymentRequests(formattedData);
    } catch (err: any) {
      const errorMessage = `An unexpected error occurred: ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      if (options.notifyUser) {
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    paymentRequests,
    isLoading,
    error,
    loadPaymentRequests,
  };
}
