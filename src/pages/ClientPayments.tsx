
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page/PageHeader";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { BalanceCards } from "@/components/payments/BalanceCards";

const ClientPayments = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos" 
        description="Visualize e gerencie seus pagamentos"
      />
      
      <BalanceCards clientBalance={15000} />
      
      <PaymentHistoryCard 
        payments={[]}
        isLoading={false} 
      />
    </div>
  );
};

export default ClientPayments;
