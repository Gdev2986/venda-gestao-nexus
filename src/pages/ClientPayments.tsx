
import { useState, useEffect } from "react";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { ClientPaymentsHeader } from "@/components/payments/ClientPaymentsHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType, PixKey } from "@/types";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";

const ClientPayments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientBalance, setClientBalance] = useState(15000);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Function to fetch client data
  const fetchClientData = async () => {
    if (!user) return;
    
    try {
      // Fetch the client ID linked to the logged-in user
      const { data: clientAccessData, error: clientAccessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (clientAccessError) {
        console.error("Error fetching client access:", clientAccessError);
        return;
      }
      
      if (!clientAccessData) {
        console.log("No client associated with this user");
        return;
      }
      
      setClientId(clientAccessData.client_id);
      
      // Fetch client data like balance
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('balance')
        .eq('id', clientAccessData.client_id)
        .single();
      
      if (clientError) {
        console.error("Error fetching client data:", clientError);
      } else if (clientData) {
        setClientBalance(clientData.balance || 15000);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  
  // Function to load payments
  const loadPayments = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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
      
      if (error) {
        console.error("Error fetching payment requests:", error);
        throw error;
      }
      
      // Function to transform the data to match the expected Payment interface
      const formattedPayments: Payment[] = data ? data.map(request => {
        // Create a proper PixKey object with all required fields
        const pixKeyData = request.pix_key ? {
          id: request.pix_key.id,
          key: request.pix_key.key,
          type: request.pix_key.type,
          name: request.pix_key.name || '',
          // Add required fields that might be missing
          owner_name: request.pix_key.name || '',
          user_id: ''  // Default value for required field
        } : undefined;
        
        return {
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
          pix_key: pixKeyData
        };
      }) : [];
      
      setPayments(formattedPayments);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar as solicitações de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch PIX keys
  const fetchPixKeys = async () => {
    if (!user) return;
    
    setIsLoadingPixKeys(true);
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching PIX keys:", error);
        throw error;
      }
      
      // Ensure each pix key has the owner_name property
      const formattedPixKeys: PixKey[] = (data || []).map(key => ({
        id: key.id,
        key: key.key,
        type: key.type,
        name: key.name || '',
        owner_name: key.name || '', // Set owner_name to name if not present
        user_id: key.user_id,
        is_default: key.is_default || false,
        created_at: key.created_at || new Date().toISOString(),
        updated_at: key.updated_at || new Date().toISOString()
      }));
      
      setPixKeys(formattedPixKeys);
    } catch (error) {
      console.error("Error fetching PIX keys:", error);
    } finally {
      setIsLoadingPixKeys(false);
    }
  };
  
  // Function to request payment
  const handleRequestPayment = async (
    amount: number,
    pixKeyId: string | null,
    description?: string
  ) => {
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível identificar o cliente"
      });
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount,
          pix_key_id: pixKeyId,
          client_id: clientId,
          description: description || "Solicitação de pagamento",
          // Use the string value directly instead of enum
          status: "PENDING"
        })
        .select();
      
      if (error) {
        console.error("Error requesting payment:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar a solicitação de pagamento"
        });
        return false;
      }
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso"
      });
      
      // Reload payments after creating a new one
      loadPayments();
      setIsDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error requesting payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao solicitar o pagamento"
      });
      return false;
    }
  };
  
  // Effect to load initial data
  useEffect(() => {
    fetchClientData();
    fetchPixKeys();
  }, [user]);
  
  // Effect to load payments when clientId is available
  useEffect(() => {
    if (clientId) {
      loadPayments();
    }
  }, [clientId]);
  
  // Set up real-time subscription for this specific client
  usePaymentSubscription(loadPayments, { 
    notifyUser: true,
    filterByClientId: clientId
  });

  return (
    <div className="flex-1">
      <ClientPaymentsHeader 
        onRequestPayment={() => setIsDialogOpen(true)} 
      />
      
      <BalanceCards clientBalance={clientBalance} />
      
      <PaymentHistoryCard 
        payments={payments} 
        isLoading={isLoading} 
      />
      
      <PaymentRequestDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={clientBalance}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={(amount, description, pixKeyId) => {
          return handleRequestPayment(parseFloat(amount), pixKeyId || "", description);
        }}
      />
    </div>
  );
};

export default ClientPayments;
