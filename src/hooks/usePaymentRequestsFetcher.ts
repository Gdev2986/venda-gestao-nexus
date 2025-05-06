
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePaymentRequestsFetcher = (initialBalance: number = 15000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(initialBalance);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Função para carregar as solicitações de pagamento do usuário logado
  const loadPaymentRequests = useCallback(async () => {
    if (!user) {
      console.log("User not authenticated, skipping payment requests fetch");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching user client access...");
      
      // Primeiro, buscar o client_id do usuário logado
      const { data: clientData, error: clientError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (clientError) {
        console.error("Error fetching client ID:", clientError);
        throw new Error("Não foi possível encontrar seu ID de cliente");
      }
      
      if (!clientData) {
        console.error("No client ID found for user", user.id);
        throw new Error("Usuário não está vinculado a nenhum cliente");
      }
      
      const clientId = clientData.client_id;
      console.log("Found client ID:", clientId);
      
      // Buscar as informações do cliente, incluindo o saldo
      const { data: clientInfoData, error: clientInfoError } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientId)
        .limit(1)
        .single();
      
      if (clientInfoError) {
        console.error("Error fetching client balance:", clientInfoError);
      } else if (clientInfoData) {
        // Atualizar o saldo do cliente
        setClientBalance(clientInfoData.balance || initialBalance);
      }
      
      // Agora buscar as solicitações de pagamento deste cliente
      console.log("Fetching payment requests for client:", clientId);
      const { data: requestsData, error: requestsError } = await supabase
        .from('payment_requests')
        .select(`
          id,
          amount,
          description,
          status,
          created_at,
          updated_at,
          rejection_reason,
          receipt_url,
          pix_key_id,
          client_id,
          pix_key:pix_keys(id, key, type, name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (requestsError) {
        console.error("Error fetching payment requests:", requestsError);
        throw requestsError;
      }
      
      console.log("Fetched payment requests:", requestsData);
      
      // Transformar os dados para o formato esperado pela interface
      const formattedRequests: Payment[] = requestsData ? requestsData.map(request => ({
        id: request.id,
        amount: request.amount,
        description: request.description || '',
        status: request.status as PaymentStatus,
        created_at: request.created_at,
        updated_at: request.updated_at,
        rejection_reason: request.rejection_reason,
        receipt_url: request.receipt_url,
        client_id: request.client_id,
        payment_type: 'PIX', // Assumindo PIX como padrão
        pix_key: request.pix_key || null
      })) : [];
      
      setPaymentRequests(formattedRequests);
    } catch (error) {
      console.error("Error in loadPaymentRequests:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar solicitações",
        description: error instanceof Error ? error.message : "Erro desconhecido ao carregar suas solicitações de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user, initialBalance]);
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadPaymentRequests();
  }, [loadPaymentRequests]);
  
  return {
    isLoading,
    clientBalance,
    paymentRequests,
    setPaymentRequests,
    loadPaymentRequests
  };
};
