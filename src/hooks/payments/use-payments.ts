import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest } from "@/types/payment.types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface UsePaymentsProps {
  clientId?: string;
}

export const usePayments = ({ clientId }: UsePaymentsProps = {}) => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from<PaymentRequest>("payment_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (clientId) {
          query = query.eq("client_id", clientId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setPayments(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching payments",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [clientId, user, toast]);

  return {
    payments,
    isLoading,
  };
};
