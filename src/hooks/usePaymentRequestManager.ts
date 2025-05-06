
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType, PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentRequestManager = (
  pixKeys: PixKey[],
  paymentRequests: Payment[],
  setPaymentRequests: React.Dispatch<React.SetStateAction<Payment[]>>
) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      // Criar solicitação de pagamento no Supabase
      // A notificação para os administradores será automaticamente gerada pelo trigger SQL
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount: parsedAmount,
          status: PaymentStatus.PENDING,
          pix_key_id: pixKeyId,
          client_id: (await supabase.from('clients').select('id').limit(1)).data?.[0]?.id,
          description: description || 'Solicitação de pagamento via PIX'
        })
        .select();
      
      if (error) throw error;

      // Criar um novo objeto de solicitação de pagamento para a UI
      const newPaymentRequest: Payment = {
        id: data?.[0]?.id || `temp_${Date.now()}`,
        amount: parsedAmount,
        status: PaymentStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_id: "client-1", // Em um aplicativo real, isso seria o ID do cliente atual
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
    } catch (err) {
      console.error('Erro ao criar solicitação de pagamento:', err);
      toast({
        variant: "destructive",
        title: "Erro ao criar solicitação",
        description: "Não foi possível criar a solicitação de pagamento."
      });
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment
  };
};
