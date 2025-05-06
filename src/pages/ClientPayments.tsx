
import { useState } from "react";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { ClientPaymentsHeader } from "@/components/payments/ClientPaymentsHeader";
import { useClientPayments } from "@/hooks/useClientPayments";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";

const ClientPayments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    isLoading,
    payments,
    clientBalance = 15000, // Valor padrão para evitar erros
    pixKeys = [],
    isLoadingPixKeys = false,
    handleRequestPayment,
    loadPayments // Adicionada função de recarga
  } = useClientPayments("client-id"); // Passa um ID de cliente padrão

  // Configurar inscrição em tempo real para esse cliente específico
  usePaymentSubscription(loadPayments, { 
    notifyUser: true,
    filterByClientId: "client-id" // Em uma implementação real, isso viria do contexto de autenticação
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
        onRequestPayment={(amount, description, pixKeyId, documentFile) => {
          // Função adaptadora para lidar com compatibilidade de tipos
          const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
          return handleRequestPayment(numAmount, pixKeyId, description);
        }}
      />
    </div>
  );
};

export default ClientPayments;
