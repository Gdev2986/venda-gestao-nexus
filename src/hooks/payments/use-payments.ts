
import { useState, useEffect } from "react";
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
          .from("payment_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (clientId) {
          query = query.eq("client_id", clientId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
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

        setPayments(formattedData);
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
  }, [clientId, user]);

  return {
    payments,
    isLoading,
  };
};
