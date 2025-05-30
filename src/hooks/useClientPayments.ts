
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PaymentStatus } from "@/types/enums";
import { PaymentRequest } from "@/types/payment.types";
import { paymentService } from "@/services/payment.service";

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
      const payments = await paymentService.getPaymentsByClient(clientId);
      setPayments(payments);
    } catch (err: any) {
      console.error("Error loading payments:", err);
      toast({
        title: "Erro",
        description: "Erro ao carregar pagamentos",
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
      await paymentService.createPaymentRequest({
        client_id: clientId,
        amount,
        payment_type: 'PIX',
        pix_key_id: pixKeyId,
        notes: description || 'Solicitação de pagamento'
      });

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso!",
      });

      // Refresh payments list
      loadPayments();
      return true;
    } catch (err: any) {
      console.error("Error requesting payment:", err);
      toast({
        title: "Erro",
        description: "Erro ao solicitar pagamento",
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
