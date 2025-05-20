
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePaymentRequestsFetcher = (initialBalance: number = 15000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(initialBalance);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to load payment requests from the authenticated user
  const loadPaymentRequests = useCallback(async () => {
    if (!user) {
      console.log("User not authenticated, skipping payment requests fetch");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching user client access...");
      
      // First, fetch the client_id of the logged-in user
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
      
      // Fetch client information, including balance
      const { data: clientInfoData, error: clientInfoError } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientId)
        .limit(1)
        .single();
      
      if (clientInfoError) {
        console.error("Error fetching client balance:", clientInfoError);
      } else if (clientInfoData) {
        // Update client balance
        setClientBalance(clientInfoData.balance || initialBalance);
      }
      
      // Now fetch payment requests for this client
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
          pix_key:pix_keys(id, key, type, name, user_id)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (requestsError) {
        console.error("Error fetching payment requests:", requestsError);
        throw requestsError;
      }
      
      console.log("Fetched payment requests:", requestsData);
      
      // Transform the data to match the expected Payment interface with all required fields
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
        payment_type: PaymentType.PIX,
        pix_key: request.pix_key ? {
          id: request.pix_key.id,
          key: request.pix_key.key,
          type: request.pix_key.type,
          name: request.pix_key.name,
          user_id: request.pix_key.user_id,
          owner_name: request.pix_key.name || '' // Use name for owner_name
        } : undefined
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
  
  // Load data when component mounts
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
