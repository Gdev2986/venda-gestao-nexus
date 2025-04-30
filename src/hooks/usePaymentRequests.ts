
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentRequests = (initialBalance: number = 15000) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(initialBalance);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch payment requests (mocked for now)
  useEffect(() => {
    const loadPaymentRequests = () => {
      setIsLoading(true);
      
      // Mock payment requests
      const mockPaymentRequests: Payment[] = [
        {
          id: "1",
          amount: 1500.0,
          status: PaymentStatus.PAID,
          created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
          updated_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
          client_id: "client-1",
          description: "Pagamento mensal",
          receipt_url: "https://example.com/receipt1",
          payment_type: PaymentType.PIX
        },
        {
          id: "2",
          amount: 2500.0,
          status: PaymentStatus.APPROVED,
          created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          updated_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          client_id: "client-1",
          description: "Retirada parcial",
          payment_type: PaymentType.TED,
          bank_info: {
            bank_name: "Banco XYZ",
            branch_number: "0001",
            account_number: "123456-7",
            account_holder: "João Silva"
          }
        },
        {
          id: "3",
          amount: 800.0,
          status: PaymentStatus.PENDING,
          created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          client_id: "client-1",
          description: "Pagamento emergencial",
          payment_type: PaymentType.PIX
        },
        {
          id: "4",
          amount: 300.0,
          status: PaymentStatus.REJECTED,
          created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          updated_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          client_id: "client-1",
          description: "Estorno",
          payment_type: PaymentType.BOLETO,
          document_url: "https://example.com/boleto1.pdf",
          rejection_reason: "Documento inválido"
        }
      ];
      
      setPaymentRequests(mockPaymentRequests);
      setIsLoading(false);
    };
    
    loadPaymentRequests();
    
    // Set up real-time subscription for new payment requests
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests' }, 
        (payload) => {
          console.log('Change received!', payload);
          // In a real app, we would fetch updated data or update our state directly
          toast({
            title: 'Atualização de pagamento',
            description: 'Status do pagamento foi atualizado',
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Handler for requesting a payment
  const handleRequestPayment = (
    amount: string,
    description: string,
    paymentType: PaymentType,
    bankInfo?: {
      bank_name: string;
      branch_number: string;
      account_number: string;
      account_holder: string;
    },
    documentFile?: File | null
  ) => {
    const parsedAmount = parseFloat(amount);
    
    // Create a new payment request object
    const newPaymentRequest: Payment = {
      id: `temp_${Date.now()}`,
      amount: parsedAmount,
      status: PaymentStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client_id: "client-1", // In a real app, this would be the actual client ID
      description: description || `Solicitação de pagamento via ${paymentType}`,
      payment_type: paymentType
    };

    // Add payment type specific data
    if (paymentType === PaymentType.TED && bankInfo) {
      newPaymentRequest.bank_info = { ...bankInfo };
    } else if (paymentType === PaymentType.BOLETO && documentFile) {
      newPaymentRequest.document_url = URL.createObjectURL(documentFile);
    }
    
    // Add the new payment request to the list
    setPaymentRequests([newPaymentRequest, ...paymentRequests]);
    
    // Show success toast
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de pagamento foi enviada com sucesso",
    });
    
    // Close the dialog
    setIsDialogOpen(false);
  };

  return {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment
  };
};
