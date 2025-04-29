
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { PaymentRequest, PixKey, PixKeyType, PaymentRequestStatus } from "@/types";

export const usePaymentRequests = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch payment requests
  const fetchPaymentRequests = async (clientId?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('payment_requests')
        .select('*');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching payment requests:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar solicitações de pagamento.",
          variant: "destructive",
        });
        return;
      }

      // Convert string status values to enum values
      const typedRequests = data?.map(item => ({
        ...item,
        status: item.status as PaymentRequestStatus
      })) || [];
      
      setPaymentRequests(typedRequests);
    } catch (error) {
      console.error("Error in fetchPaymentRequests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch PIX keys
  const fetchPixKeys = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) {
        console.error("Error fetching PIX keys:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar chaves PIX.",
          variant: "destructive",
        });
        return;
      }

      // Convert string type values to enum values
      const typedKeys = data?.map(item => ({
        ...item,
        type: item.type as PixKeyType
      })) || [];
      
      setPixKeys(typedKeys);
    } catch (error) {
      console.error("Error in fetchPixKeys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new payment request
  const createPaymentRequest = async (data: Omit<PaymentRequest, "id" | "status" | "created_at" | "updated_at" | "approved_at" | "approved_by" | "receipt_url">) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          ...data,
          status: PaymentRequestStatus.PENDING
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso.",
      });

      await fetchPaymentRequests();
      return true;
    } catch (error: any) {
      console.error("Error creating payment request:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar solicitação de pagamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add new PIX key
  const addPixKey = async (pixKeyData: Omit<PixKey, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .insert([pixKeyData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });

      await fetchPixKeys();
      return true;
    } catch (error: any) {
      console.error("Error adding PIX key:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao adicionar chave PIX.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Process payment request (approve/reject)
  const processPaymentRequest = async (id: string, action: 'approve' | 'reject', userId: string, receiptUrl?: string) => {
    try {
      const status = action === 'approve' ? PaymentRequestStatus.APPROVED : PaymentRequestStatus.REJECTED;
      
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status,
          approved_by: userId,
          approved_at: new Date().toISOString(),
          receipt_url: receiptUrl
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: action === 'approve' ? "Pagamento aprovado" : "Pagamento rejeitado",
        description: action === 'approve' ? "O pagamento foi aprovado com sucesso." : "O pagamento foi rejeitado.",
      });

      await fetchPaymentRequests();
      return true;
    } catch (error: any) {
      console.error("Error processing payment request:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao processar a solicitação de pagamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    paymentRequests,
    pixKeys,
    isLoading,
    fetchPaymentRequests,
    fetchPixKeys,
    createPaymentRequest,
    addPixKey,
    processPaymentRequest
  };
};
