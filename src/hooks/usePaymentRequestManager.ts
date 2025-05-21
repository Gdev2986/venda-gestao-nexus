
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType, PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePaymentRequestManager = (
  pixKeys: PixKey[],
  paymentRequests: Payment[],
  setPaymentRequests: React.Dispatch<React.SetStateAction<Payment[]>>
) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  // Handler for requesting a payment
  const handleRequestPayment = async (
    amount: string,
    description: string,
    pixKeyId: string | null
  ) => {
    if (!pixKeyId) {
      toast({
        variant: "destructive",
        title: "Chave PIX não selecionada",
        description: "Por favor, selecione uma chave PIX para continuar.",
      });
      return false;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Usuário não autenticado",
        description: "Por favor, faça login para continuar.",
      });
      return false;
    }
    
    const parsedAmount = parseFloat(amount);
    const selectedPixKey = pixKeys.find(key => key.id === pixKeyId);
    
    if (!selectedPixKey) {
      toast({
        variant: "destructive",
        title: "Chave PIX inválida",
        description: "A chave PIX selecionada não é válida.",
      });
      return false;
    }
    
    try {
      console.log("Attempting to create payment request with:", {
        amount: parsedAmount,
        pixKeyId,
        userId: user.id
      });
      
      // Get the client ID for the current user
      const { data: clientData, error: clientError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
        
      if (clientError) {
        console.error("Error fetching client ID:", clientError);
        toast({
          variant: "destructive",
          title: "Erro ao criar solicitação",
          description: "Não foi possível identificar seu cliente. Por favor, contate o suporte."
        });
        return false;
      }
      
      if (!clientData?.client_id) {
        toast({
          variant: "destructive",
          title: "Erro ao criar solicitação",
          description: "Seu usuário não está vinculado a nenhum cliente. Por favor, contate o suporte."
        });
        return false;
      }
      
      console.log("Creating payment request for client:", clientData.client_id);
      
      // Create payment request in Supabase with string status instead of enum
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount: parsedAmount,
          status: "PENDING", // Use string literal instead of enum
          pix_key_id: pixKeyId,
          client_id: clientData.client_id,
          description: description || 'Solicitação de pagamento via PIX'
        })
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
        .single();
      
      if (error) {
        console.error("Erro ao criar solicitação de pagamento:", error);
        toast({
          variant: "destructive",
          title: "Erro ao criar solicitação",
          description: error.message || "Não foi possível criar a solicitação de pagamento."
        });
        return false;
      }

      if (!data) {
        toast({
          variant: "destructive", 
          title: "Erro ao criar solicitação",
          description: "Não foi possível criar a solicitação de pagamento."
        });
        return false;
      }

      console.log("Created payment request:", data);

      // Create a new payment request object for the UI
      const newPaymentRequest: Payment = {
        id: data.id,
        amount: data.amount,
        status: data.status as PaymentStatus, // Cast status
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_id: data.client_id,
        description: data.description,
        payment_type: PaymentType.PIX,
        pix_key: data.pix_key ? {
          id: data.pix_key.id,
          key: data.pix_key.key,
          type: data.pix_key.type,
          owner_name: data.pix_key.name
        } : undefined,
        rejection_reason: null
      };
      
      // Add the new payment request to the list
      setPaymentRequests(prev => [newPaymentRequest, ...prev]);
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso",
      });
      
      // Close the dialog
      setIsDialogOpen(false);
      return true;
    } catch (err) {
      console.error('Erro ao criar solicitação de pagamento:', err);
      toast({
        variant: "destructive",
        title: "Erro ao criar solicitação",
        description: err instanceof Error ? err.message : "Não foi possível criar a solicitação de pagamento."
      });
      return false;
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment
  };
};
