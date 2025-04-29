
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestStatus, PixKey, PixKeyType } from "@/types";
import { useToast } from "@/hooks/use-toast";

// For better typing, define database types
interface PaymentRequestDb {
  id: string;
  amount: number;
  status: string; // Database string enum will be cast to PaymentRequestStatus
  client_id: string;
  pix_key_id: string;
  receipt_url?: string;
  created_at?: string;
  updated_at?: string;
  approved_at?: string;
  approved_by?: string;
}

interface PixKeyDb {
  id: string;
  key: string;
  name: string;
  type: string; // Database string enum will be cast to PixKeyType
  is_default: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const usePaymentRequests = () => {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch client ID and data
  const fetchClientData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setClientId(data.id);
        return data.id;
      }
    } catch (error) {
      console.error("Error fetching client ID:", error);
      return null;
    }
  };
  
  // Fetch payment requests
  const fetchPaymentRequests = async (cid: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('client_id', cid)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert to PaymentRequest type with proper enum values
      const typedRequests: PaymentRequest[] = (data || []).map((req: PaymentRequestDb) => ({
        ...req,
        status: req.status as PaymentRequestStatus
      }));
      
      setPaymentRequests(typedRequests);
    } catch (error) {
      console.error("Error fetching payment requests:", error);
    }
  };
  
  // Fetch PIX keys
  const fetchPixKeys = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Convert to PixKey type with proper enum values
      const typedKeys: PixKey[] = (data || []).map((key: PixKeyDb) => ({
        ...key,
        type: key.type as PixKeyType
      }));
      
      setPixKeys(typedKeys);
    } catch (error) {
      console.error("Error fetching PIX keys:", error);
    }
  };
  
  // Calculate current balance
  const fetchCurrentBalance = async (cid: string) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('net_amount')
        .eq('client_id', cid);
      
      if (error) {
        throw error;
      }
      
      const totalSales = data?.reduce((sum, sale) => sum + Number(sale.net_amount), 0) || 0;
      
      // Subtract approved payment requests
      const { data: requests, error: requestsError } = await supabase
        .from('payment_requests')
        .select('amount')
        .eq('client_id', cid)
        .in('status', ['APPROVED', 'PAID']);
      
      if (requestsError) {
        throw requestsError;
      }
      
      const totalPaid = requests?.reduce((sum, req) => sum + Number(req.amount), 0) || 0;
      
      setCurrentBalance(totalSales - totalPaid);
    } catch (error) {
      console.error("Error calculating balance:", error);
    }
  };
  
  // Create payment request
  const createPaymentRequest = async (amount: number, pixKeyId: string) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Dados do cliente não encontrados.",
        variant: "destructive"
      });
      return false;
    }
    
    if (amount <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser maior que zero.",
        variant: "destructive"
      });
      return false;
    }
    
    if (amount > currentBalance) {
      toast({
        title: "Erro",
        description: "O valor solicitado é maior que seu saldo disponível.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          client_id: clientId,
          amount: amount,
          pix_key_id: pixKeyId,
          status: 'PENDING'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Refresh data
      fetchData();
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating payment request:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua solicitação.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Add PIX key
  const addPixKey = async (keyData: Omit<PixKey, "id">) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // If this is the first key, set it as default
      if (pixKeys.length === 0) {
        keyData.is_default = true;
      }
      
      const { data, error } = await supabase
        .from('pix_keys')
        .insert({
          ...keyData,
          user_id: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      fetchPixKeys();
      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi cadastrada com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error adding PIX key:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a chave PIX.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cid = await fetchClientData();
      if (cid) {
        await Promise.all([
          fetchPaymentRequests(cid),
          fetchPixKeys(),
          fetchCurrentBalance(cid)
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up realtime subscription for payment requests
      const channel = supabase
        .channel('payment-requests-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payment_requests',
            filter: clientId ? `client_id=eq.${clientId}` : undefined
          },
          (payload) => {
            console.log('Payment request update:', payload);
            // Refresh data on changes
            fetchData();
            
            // Show notification for status changes
            if (payload.eventType === 'UPDATE') {
              const newData = payload.new as PaymentRequest;
              if (newData.status === 'APPROVED') {
                toast({
                  title: "Pagamento aprovado",
                  description: `Seu pagamento de R$ ${Number(newData.amount).toFixed(2)} foi aprovado.`,
                });
              } else if (newData.status === 'REJECTED') {
                toast({
                  title: "Pagamento rejeitado",
                  description: `Seu pagamento de R$ ${Number(newData.amount).toFixed(2)} foi rejeitado.`,
                  variant: "destructive"
                });
              } else if (newData.status === 'PAID') {
                toast({
                  title: "Pagamento realizado",
                  description: `Seu pagamento de R$ ${Number(newData.amount).toFixed(2)} foi realizado.`,
                });
              }
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, clientId]);
  
  return {
    paymentRequests,
    pixKeys,
    currentBalance,
    isLoading,
    createPaymentRequest,
    addPixKey,
    refreshData: fetchData
  };
};
