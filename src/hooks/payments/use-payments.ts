
import { useState, useEffect } from "react";
import { Payment } from "@/types/payment.types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentStatus } from "@/types/enums";

export interface UsePaymentsReturn {
  payments: Payment[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function usePayments(): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) {
      setIsLoading(false);
      setPayments([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, get the client_id for the user
      const { data: clientData, error: clientError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        throw new Error('Failed to retrieve client information');
      }

      if (!clientData?.client_id) {
        setPayments([]);
        return;
      }

      const { data, error: paymentsError } = await supabase
        .from('payment_requests')
        .select(`
          id,
          amount,
          description,
          status,
          pix_key_id,
          created_at,
          updated_at,
          approved_at,
          approved_by,
          receipt_url,
          rejection_reason,
          client_id,
          pix_key:pix_keys (
            id, 
            key,
            type,
            name,
            owner_name
          )
        `)
        .eq('client_id', clientData.client_id)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        throw new Error(paymentsError.message);
      }

      // Transform the data to match the Payment type
      const transformedPayments = (data || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        description: payment.description || '',
        status: payment.status as PaymentStatus,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        approved_at: payment.approved_at,
        approved_by: payment.approved_by,
        receipt_url: payment.receipt_url,
        rejection_reason: payment.rejection_reason,
        client_id: payment.client_id,
        pix_key: payment.pix_key ? {
          id: payment.pix_key.id,
          key: payment.pix_key.key,
          type: payment.pix_key.type || '',
          owner_name: payment.pix_key.owner_name || payment.pix_key.name || ''
        } : undefined
      }));

      setPayments(transformedPayments);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: err.message || "Não foi possível carregar seus pagamentos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    isLoading,
    error,
    mutate: fetchPayments
  };
}
