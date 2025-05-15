
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PageWrapper } from "@/components/page/PageWrapper";
import AdminPaymentsList from "@/components/payments/AdminPaymentsList";
import { useAdminPayments } from "@/hooks/payments/useAdminPayments";
import { PaymentStatus } from "@/types";
import { PaymentAction } from "@/components/payments/PaymentTableColumns";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  
  const {
    payments,
    isLoading,
    totalPages,
    refetch,
    performPaymentAction,
  } = useAdminPayments({
    searchTerm,
    statusFilter,
    page,
  });

  const handleFilterChange = (newSearchTerm: string, newStatus: PaymentStatus | 'ALL') => {
    setSearchTerm(newSearchTerm);
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when filters change
  };

  const handlePaymentAction = (paymentId: string, action: PaymentAction) => {
    performPaymentAction(paymentId, action);
  };

  return (
    <>
      <PageHeader 
        title="Pagamentos" 
        description="Gerenciar solicitações de pagamento"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW}
      />

      <PaymentFilters
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        onFilterChange={handleFilterChange}
      />

      <PageWrapper>
        <AdminPaymentsList 
          payments={payments}
          isLoading={isLoading}
          onAction={handlePaymentAction}
        />
      </PageWrapper>
    </>
  );
};

export default AdminPayments;
