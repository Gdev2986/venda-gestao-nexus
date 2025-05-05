
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPaymentRequests } from "@/utils/mock-payment-data";

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
        // Map the data to our Payment interface
        const formattedData = data.map((item) => ({
          id: item.id,
          amount: item.amount,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          client_id: item.client_id,
          description: item.description || "",
          payment_type: "PIX",
          receipt_url: item.receipt_url,
          rejection_reason: item.rejection_reason || null,
          approved_at: item.approved_at,
          pix_key: item.pix_key ? {
            id: item.pix_key.id,
            key: item.pix_key.key,
            type: item.pix_key.type,
            owner_name: item.pix_key.name
          } : undefined
        }));
        
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
