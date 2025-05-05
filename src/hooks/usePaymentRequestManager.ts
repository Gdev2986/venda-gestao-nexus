
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

  // Handler for requesting a payment
  const handleRequestPayment = async (
    amount: string,
    description: string,
    pixKeyId: string | null,
    documentFile?: File | null
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
      // Store document if provided
      let documentUrl = null;
      if (documentFile) {
        const fileName = `payment_doc_${Date.now()}.${documentFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, documentFile);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        documentUrl = urlData.publicUrl;
      }
      
      // Create payment request in Supabase
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount: parsedAmount,
          status: PaymentStatus.PENDING,
          pix_key_id: pixKeyId,
          client_id: (await supabase.from('clients').select('id').limit(1)).data?.[0]?.id,
          description: description || 'Solicitação de pagamento via PIX',
          receipt_url: documentUrl
        })
        .select();
      
      if (error) throw error;

      // Create a new payment request object for the UI
      const newPaymentRequest: Payment = {
        id: data?.[0]?.id || `temp_${Date.now()}`,
        amount: parsedAmount,
        status: PaymentStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_id: "client-1", // In a real app, this would be the actual client ID
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
      
      // Add the document if provided
      if (documentFile) {
        newPaymentRequest.document_url = documentUrl || URL.createObjectURL(documentFile);
      }
      
      // Add the new payment request to the list
      setPaymentRequests([newPaymentRequest, ...paymentRequests]);
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso",
      });
      
      // Close the dialog
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error creating payment request:', err);
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
