
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPaymentRequests } from "@/utils/mock-payment-data";

export const useClientPayments = (clientId: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);

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
        // Map the data to our Payment interface
        const formattedData: Payment[] = data.map((item) => ({
          id: item.id,
          amount: item.amount,
          status: item.status as PaymentStatus,
          created_at: item.created_at,
          updated_at: item.updated_at,
          client_id: item.client_id,
          description: item.description || "",
          payment_type: PaymentType.PIX,
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

  useEffect(() => {
    loadClientPayments();
  }, [clientId, toast]);

  return {
    isLoading,
    payments,
    loadClientPayments
  };
};
