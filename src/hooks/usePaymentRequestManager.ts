
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PixKey, Payment, PaymentStatus, PaymentType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { generateUuid } from "@/lib/supabase-utils";

export const usePaymentRequestManager = (
  pixKeys: PixKey[],
  paymentRequests: Payment[],
  setPaymentRequests: React.Dispatch<React.SetStateAction<Payment[]>>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPixKey, setSelectedPixKey] = useState<PixKey | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

// Fix the handleRequestPayment function to include the required properties for PixKey
const handleRequestPayment = async (values: {
  amount: number;
  pixKeyId: string;
  description?: string;
}) => {
  if (!selectedPixKey) {
    toast({
      title: "Chave Pix não selecionada",
      description: "Selecione uma chave Pix para realizar a solicitação",
      variant: "destructive",
    });
    return;
  }

  // Find the selected pix key
  const pixKey = pixKeys.find((key) => key.id === values.pixKeyId);
  
  if (!pixKey) {
    toast({
      title: "Chave Pix não encontrada",
      description: "A chave Pix selecionada não foi encontrada",
      variant: "destructive",
    });
    return;
  }

  if (!values.amount) {
    toast({
      title: "Valor inválido",
      description: "Informe um valor para a solicitação",
      variant: "destructive",
    });
    return;
  }

  try {
    // Create the payment request
    const { data, error } = await supabase.from("payment_requests").insert([
      {
        amount: values.amount,
        description: values.description || "Solicitação de pagamento",
        pix_key_id: values.pixKeyId,
        client_id: user?.id,
        status: "PENDING",
      },
    ]);

    if (error) throw error;

    // Create formatted payment for UI
    const newPayment: Payment = {
      id: data?.[0]?.id || generateUuid(),
      amount: values.amount,
      description: values.description || "Solicitação de pagamento",
      status: PaymentStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rejection_reason: null,
      client_id: user?.id || "",
      receipt_url: "",
      payment_type: PaymentType.PIX,
      pix_key: {
        id: pixKey.id,
        key: pixKey.key,
        type: pixKey.type,
        name: pixKey.name,
        user_id: pixKey.user_id,
        owner_name: pixKey.owner_name
      }
    };

    setPaymentRequests([...paymentRequests, newPayment]);
    setIsDialogOpen(false);
    toast({
      title: "Solicitação enviada!",
      description: "Aguarde a confirmação do pagamento",
    });
  } catch (error: any) {
    console.error("Error requesting payment:", error);
    toast({
      title: "Erro ao solicitar pagamento",
      description:
        error.message || "Ocorreu um erro ao solicitar o pagamento. Tente novamente.",
      variant: "destructive",
    });
  }
};

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    selectedPixKey,
    setSelectedPixKey
  };
};
