import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { useClientPayments } from "@/hooks/useClientPayments";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePixKeys } from "@/hooks/usePixKeys";
import { PaymentType } from "@/types/payment.types";
import { useClientBalance } from "@/hooks/use-client-balance";
import { convertRequestToPayment } from "@/components/payments/payment-list/PaymentConverter";
import { supabase } from "@/integrations/supabase/client";
import { paymentService } from "@/services/payment.service";
import { toast } from "@/hooks/use-toast";

const UserPayments = () => {
  const { user } = useAuth();
  const { balance } = useClientBalance();
  const { payments, isLoading, loadPayments } = useClientPayments();
  const { pixKeys, isLoading: isLoadingPixKeys, refetch: refetchPixKeys } = usePixKeys();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Set up real-time subscription for client-specific payment updates
  // Get client ID from the authenticated user context
  const clientId = user?.id; // In a real implementation, this should be properly mapped to client_id
  
  usePaymentSubscription(loadPayments, { 
    notifyUser: true, 
    filterByClientId: clientId 
  });
  
  // Handle payment request
  const handleRequestPayment = async (type: PaymentType, data: any) => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Get client ID
      const { data: clientData } = await supabase.rpc('get_user_client_id', {
        user_uuid: user.id
      });

      if (!clientData) {
        toast({
          title: "Erro",
          description: "Cliente não encontrado",
          variant: "destructive"
        });
        return;
      }

      const params = {
        client_id: clientData,
        amount: data.amount,
        payment_type: type,
        notes: data.notes,
        ...(type === 'PIX' && {
          pix_key_id: data.pix_key_id,
          new_pix_key: data.new_pix_key
        }),
        ...(type === 'BOLETO' && {
          boleto_file: data.boleto_file,
          boleto_code: data.boleto_code
        })
      };

      await paymentService.createPaymentRequest(params);

      toast({
        title: "Solicitação enviada",
        description: `Sua solicitação de ${type === 'PIX' ? 'pagamento PIX' : 'pagamento de boleto'} foi enviada com sucesso!`
      });

      // Refresh data
      loadPayments();
      refetchPixKeys(); // Refresh PIX keys in case a new one was created
      setIsDialogOpen(false);

    } catch (error: any) {
      console.error('Error requesting payment:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao solicitar pagamento",
        variant: "destructive"
      });
    }
  };
  
  // Log some debugging info
  useEffect(() => {
    console.log("Current user role:", user?.role);
    console.log("Payment requests:", payments);
    console.log("Available PIX keys:", pixKeys);
  }, [user, payments, pixKeys]);

  // Convert PaymentRequest[] to Payment[] for compatibility and ensure rejection_reason is always a string
  const convertedPayments = payments.map(payment => {
    const converted = convertRequestToPayment(payment);
    return {
      ...converted,
      rejection_reason: converted.rejection_reason || ""
    };
  });
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Payments" 
        description="Manage your payment requests and financial transactions"
      />
      
      <BalanceCards clientBalance={balance || 0} />
      
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Request Payment</Button>
      </div>
      
      <PaymentHistoryCard 
        payments={convertedPayments}
        isLoading={isLoading} 
      />
      
      <PaymentRequestDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={balance || 0}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default UserPayments;
