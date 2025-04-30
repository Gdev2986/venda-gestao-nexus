
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";

const UserPayments = () => {
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys
  } = usePaymentRequests();
  
  const { userRole } = useUserRole();
  
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <SendIcon className="h-4 w-4 mr-2" />
          Solicitar Pagamento
        </Button>
      </div>
      
      <BalanceCards clientBalance={clientBalance} />
      
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
