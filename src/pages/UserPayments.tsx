
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
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
    handleRequestPayment
  } = usePaymentRequests();
  
  const { userRole } = useUserRole();
  
  return (
    <MainLayout>
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
        onRequestPayment={handleRequestPayment}
      />
    </MainLayout>
  );
};

export default UserPayments;
