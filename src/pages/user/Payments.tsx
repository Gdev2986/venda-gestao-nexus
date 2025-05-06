
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { useEffect } from "react";

const UserPayments = () => {
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys,
    loadPaymentRequests
  } = usePaymentRequests();

  // Set up real-time subscription for client-specific payment updates
  // Using a mock client ID for demo purposes - in real app, get from auth context
  const clientId = "client-id"; // In a real implementation, this would come from auth context
  
  usePaymentSubscription(loadPaymentRequests, { 
    notifyUser: true, 
    filterByClientId: clientId 
  });
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Payments" 
        description="Manage your payment requests and financial transactions"
      />
      
      <BalanceCards clientBalance={clientBalance} />
      
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Request Payment</Button>
      </div>
      
      <PaymentHistoryCard 
        payments={paymentRequests}
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

export default UserPayments;
