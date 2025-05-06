
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType, PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPaymentRequests } from "@/utils/mock-payment-data";
import { formatPaymentRequest } from "@/services/payment.service";

export const useClientPayments = (clientId: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientBalance, setClientBalance] = useState(15000); // Default balance for mock data
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
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
        const formattedData = data.map(item => {
          // Add rejection_reason field if it doesn't exist in the database
          const itemWithRejectionReason = {
            ...item,
            rejection_reason: item.rejection_reason || null
          };
          return formatPaymentRequest(itemWithRejectionReason);
        });
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

  // Mock PixKeys retrieval for client
  const loadPixKeys = async () => {
    setIsLoadingPixKeys(true);
    
    try {
      // Here we would normally fetch PIX keys for the client
      // For now, creating mock PIX keys
      setTimeout(() => {
        setPixKeys([
          { id: '1', key: '123.456.789-00', type: 'CPF', owner_name: 'João da Silva' },
          { id: '2', key: 'email@example.com', type: 'EMAIL', owner_name: 'João da Silva' },
          { id: '3', key: '+5511999999999', type: 'PHONE', owner_name: 'João da Silva' },
        ]);
        setIsLoadingPixKeys(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading PIX keys:', error);
      setIsLoadingPixKeys(false);
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
    loadPixKeys();
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
