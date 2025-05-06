
import { useState } from "react";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { ClientPaymentsHeader } from "@/components/payments/ClientPaymentsHeader";
import { useClientPayments } from "@/hooks/useClientPayments";

const ClientPayments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    isLoading,
    payments,
    clientBalance = 15000, // Default value to prevent errors
    pixKeys = [],
    isLoadingPixKeys = false,
    handleRequestPayment = () => {}
  } = useClientPayments("client-id"); // Pass a default client ID

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
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default ClientPayments;
