import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest } from "@/types/payment.types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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

      setPaymentRequests(data || []);
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
