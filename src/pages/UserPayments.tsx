
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page/PageHeader";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { BalanceCards } from "@/components/payments/BalanceCards";

const UserPayments = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Pagamentos" 
        description="Gerencie suas solicitações de pagamento"
      />
      
      <BalanceCards clientBalance={15000} />
      
      <PaymentHistoryCard 
        payments={[]}
        isLoading={false} 
      />
    </div>
  );
};

export default UserPayments;
