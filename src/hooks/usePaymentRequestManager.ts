
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

  // Handler para solicitar um pagamento
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
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Usuário não autenticado",
        description: "Por favor, faça login para continuar.",
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    const selectedPixKey = pixKeys.find(key => key.id === pixKeyId);
    
    if (!selectedPixKey) {
      toast({
        variant: "destructive",
        title: "Chave PIX inválida",
        description: "A chave PIX selecionada não é válida.",
      });
      return;
    }
    
    try {
      console.log("Attempting to create payment request with:", {
        amount: parsedAmount,
        pixKeyId,
        user
      });
      
      // Get the client ID for the current user
      const { data: clientData, error: clientError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
        
      if (clientError || !clientData) {
        console.error("Error fetching client ID:", clientError);
        throw new Error("Não foi possível encontrar seu ID de cliente");
      }
      
      // Criar solicitação de pagamento no Supabase
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount: parsedAmount,
          status: PaymentStatus.PENDING,
          pix_key_id: pixKeyId,
          client_id: clientData.client_id,
          description: description || 'Solicitação de pagamento via PIX'
        })
        .select();
      
      if (error) {
        console.error("Erro ao criar solicitação de pagamento:", error);
        throw error;
      }

      // Criar um novo objeto de solicitação de pagamento para a UI
      const newPaymentRequest: Payment = {
        id: data?.[0]?.id || `temp_${Date.now()}`,
        amount: parsedAmount,
        status: PaymentStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_id: clientData.client_id,
        description: description || `Solicitação de pagamento via PIX`,
        payment_type: PaymentType.PIX,
        pix_key: {
          id: selectedPixKey.id,
          key: selectedPixKey.key,
          type: selectedPixKey.type,
          owner_name: selectedPixKey.owner_name
        },
        rejection_reason: null
      };
      
      // Adicionar a nova solicitação de pagamento à lista
      setPaymentRequests([newPaymentRequest, ...paymentRequests]);
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso",
      });
      
      // Fechar o diálogo
      setIsDialogOpen(false);
      return true;
    } catch (err) {
      console.error('Erro ao criar solicitação de pagamento:', err);
      toast({
        variant: "destructive",
        title: "Erro ao criar solicitação",
        description: "Não foi possível criar a solicitação de pagamento."
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
