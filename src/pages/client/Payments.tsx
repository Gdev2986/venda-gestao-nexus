
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { useClientBalance } from "@/hooks/use-client-balance";
import { useAuth } from "@/hooks/use-auth";

const ClientPayments = () => {
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useClientBalance();

  // Mock payment data for now
  const mockPayments = [
    {
      id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      amount: 1500.00,
      status: "PENDING" as const,
      description: "Solicitação de pagamento",
      pix_key_id: "1",
      client_id: user?.id || "mock-client-id",
      rejection_reason: null
    },
    {
      id: "2", 
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      amount: 2300.50,
      status: "APPROVED" as const,
      description: "Pagamento aprovado",
      pix_key_id: "1",
      client_id: user?.id || "mock-client-id",
      rejection_reason: null
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Pagamentos"
        description="Visualize e gerencie suas solicitações de pagamento"
      />
      
      <BalanceCards clientBalance={balance || 0} />
      
      <PaymentHistoryCard 
        payments={mockPayments}
        isLoading={balanceLoading} 
      />
    </div>
  );
};

export default ClientPayments;
