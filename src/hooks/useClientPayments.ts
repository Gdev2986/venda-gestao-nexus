
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

export const useClientPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  // Get client ID first
  useEffect(() => {
    const getClientId = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase.rpc('get_user_client_id', {
          user_uuid: user.id
        });
        setClientId(data);
      } catch (error) {
        console.error("Error getting client ID:", error);
      }
    };

    getClientId();
  }, [user]);

  const loadPayments = useCallback(async () => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: "Erro ao carregar pagamentos",
          description: error.message,
          variant: "destructive",
        });
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

      setPayments(formattedData);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar pagamentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const requestPayment = async (amount: number, pixKeyId: string, description?: string) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "ID do cliente não encontrado",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert([
          {
            client_id: clientId,
            amount,
            pix_key_id: pixKeyId,
            status: 'PENDING',
            description: description || 'Solicitação de pagamento'
          }
        ]);

      if (error) {
        console.error("Error creating payment request:", error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso!",
      });

      // Refresh payments list
      loadPayments();
      return true;
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao solicitar pagamento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (clientId) {
      loadPayments();
    }
  }, [clientId, loadPayments]);

  return {
    payments,
    isLoading,
    loadPayments,
    requestPayment
  };
};
