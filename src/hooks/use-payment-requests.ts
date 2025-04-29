
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { PaymentRequest, PixKey as PixKeyType, PixKeyType as PixKeyEnum, PaymentRequestStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Export the PixKey type so it can be used in other components
export type PixKey = PixKeyType;

export const usePaymentRequests = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

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
        type: item.type as PixKeyEnum
      })) || [];
      
      setPixKeys(typedKeys);
    } catch (error) {
      console.error("Error in fetchPixKeys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch client balance
  const fetchClientBalance = async (clientId?: string) => {
    try {
      if (!clientId && !user) return;
      
      // Fetch client ID if not provided
      if (!clientId && user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (clientData) {
          clientId = clientData.id;
        }
      }

      if (clientId) {
        const { data } = await supabase
          .from('vw_client_balance')
          .select('balance')
          .eq('client_id', clientId)
          .maybeSingle();

        if (data) {
          setCurrentBalance(Number(data.balance) || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching client balance:", error);
    }
  };

  // Create new payment request
  const createPaymentRequest = async (amount: number, pixKeyId: string) => {
    try {
      // Get client ID for the current user
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error("Error fetching client ID:", clientError);
        toast({
          title: "Erro",
          description: "Não foi possível identificar seu cliente.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          amount,
          pix_key_id: pixKeyId,
          client_id: clientData.id,
          status: PaymentRequestStatus.PENDING
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso.",
      });

      await fetchPaymentRequests(clientData.id);
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
        .insert([{
          ...pixKeyData,
          user_id: user?.id
        }]);

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

  // Refresh all data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Get client ID for the current user
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (clientData) {
        await Promise.all([
          fetchPaymentRequests(clientData.id),
          fetchClientBalance(clientData.id)
        ]);
      }
      await fetchPixKeys();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  return {
    paymentRequests,
    pixKeys,
    isLoading,
    currentBalance,
    fetchPaymentRequests,
    fetchPixKeys,
    createPaymentRequest,
    addPixKey,
    processPaymentRequest,
    refreshData
  };
};
