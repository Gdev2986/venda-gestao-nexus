
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

const UserPayments = () => {
  const { user } = useAuth();
  const { balance } = useClientBalance();
  const { payments, isLoading, loadPayments } = useClientPayments();
  const { pixKeys, isLoading: isLoadingPixKeys } = usePixKeys();
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
    console.log("Payment request:", type, data);
    // The actual implementation would be handled by the useClientPayments hook
    setIsDialogOpen(false);
  };
  
  // Log some debugging info
  useEffect(() => {
    console.log("Current user role:", user?.role);
    console.log("Payment requests:", payments);
    console.log("Available PIX keys:", pixKeys);
  }, [user, payments, pixKeys]);

  // Convert PaymentRequest[] to Payment[] for compatibility
  const convertedPayments = payments.map(payment => convertRequestToPayment(payment));

  // Convert PixKeys to match the expected interface
  const convertedPixKeys = pixKeys.map(key => ({
    ...key,
    owner_name: key.owner_name || key.name // Ensure owner_name is always present
  }));
  
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
        pixKeys={convertedPixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default UserPayments;
