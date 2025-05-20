
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePixKeys } from "@/hooks/usePixKeys";

const UserPayments = () => {
  const { user } = useAuth();
  
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment: originalHandleRequestPayment,
    loadPaymentRequests
  } = usePaymentRequests();

  const { pixKeys, isLoadingPixKeys } = usePixKeys();
  
  // Set up real-time subscription for client-specific payment updates
  // Get client ID from the authenticated user context
  const clientId = user?.id; // In a real implementation, this should be properly mapped to client_id
  
  usePaymentSubscription(loadPaymentRequests, { 
    notifyUser: true, 
    filterByClientId: clientId 
  });
  
  // Adapter function to match expected interface
  const handleRequestPayment = (amount: string, description: string, pixKeyId: string) => {
    return originalHandleRequestPayment({
      amount: parseFloat(amount),
      description,
      pixKeyId
    });
  };
  
  // Log some debugging info
  useEffect(() => {
    console.log("Current user role:", user?.role);
    console.log("Payment requests:", paymentRequests);
    console.log("Available PIX keys:", pixKeys);
  }, [user, paymentRequests, pixKeys]);
  
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
