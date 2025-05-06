
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPaymentRequests } from "@/utils/mock-payment-data";
import { formatPaymentRequest } from "@/services/payment.service";

export const usePaymentRequestsFetcher = (initialBalance: number = 15000) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(initialBalance);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);

  const loadPaymentRequests = async () => {
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
          ),
          client:client_id (
            id,
            business_name,
            email
          )
        `)
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
        setPaymentRequests(formattedData);
      } else {
        // Use mock data if no real data is available
        setPaymentRequests(getMockPaymentRequests());
      }
    } catch (err) {
      console.error('Error fetching payment requests:', err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar as solicitações de pagamento."
      });
      
      // Use mock data as fallback
      setPaymentRequests(getMockPaymentRequests());
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of payment requests
  useEffect(() => {
    loadPaymentRequests();
  }, [toast]);

  return {
    isLoading,
    clientBalance,
    paymentRequests,
    setPaymentRequests,
    loadPaymentRequests
  };
};
