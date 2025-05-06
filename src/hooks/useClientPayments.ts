
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPaymentRequests } from "@/utils/mock-payment-data";
import { formatPaymentRequest } from "@/services/payment.service";

export const useClientPayments = (clientId: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientBalance, setClientBalance] = useState(15000); // Default balance for mock data
  const [pixKeys, setPixKeys] = useState([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(false);

  const loadClientPayments = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          *,
          pix_key:pix_key_id (
            id,
            key,
            type,
            name
          )
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map the data to our Payment interface using the service function
        const formattedData = data.map(item => formatPaymentRequest(item));
        setPayments(formattedData);
      } else {
        // Use mock data if no real data is available
        const mockData = getMockPaymentRequests().filter(p => p.client_id === clientId);
        setPayments(mockData);
      }
    } catch (err) {
      console.error('Error fetching client payment requests:', err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar os pagamentos deste cliente."
      });
      
      // Use mock data as fallback, filtered by client
      const mockData = getMockPaymentRequests().filter(p => p.client_id === clientId);
      setPayments(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function for payment requests
  const handleRequestPayment = async (amount: number, pixKeyId: string, description: string) => {
    try {
      toast({
        title: "Pagamento solicitado",
        description: "Sua solicitação de pagamento foi enviada com sucesso."
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao solicitar pagamento",
        description: "Não foi possível enviar sua solicitação de pagamento."
      });
      return false;
    }
  };

  useEffect(() => {
    loadClientPayments();
  }, [clientId, toast]);

  return {
    isLoading,
    payments,
    clientBalance,
    pixKeys,
    isLoadingPixKeys,
    handleRequestPayment,
    loadClientPayments
  };
};
