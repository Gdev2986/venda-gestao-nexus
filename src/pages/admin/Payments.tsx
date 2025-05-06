
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { PageWrapper } from "@/components/page/PageWrapper";
import { AdminPaymentsList } from "@/components/payments/AdminPaymentsList";
import { PaymentDialogs } from "@/components/payments/PaymentDialogs";
import { PaymentNotifications } from "@/components/payments/PaymentNotifications";
import { useAdminPayments } from "@/hooks/payments/useAdminPayments";

const AdminPayments = () => {
  const {
    // Payment data
    paymentRequests,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    refreshPayments,
    
    // Filters
    statusFilter,
    searchTerm,
    handleFilterChange,
    
    // Dialog state
    selectedPayment,
    approveDialogOpen,
    rejectDialogOpen,
    detailsDialogOpen,
    setApproveDialogOpen,
    setRejectDialogOpen,
    setDetailsDialogOpen,
    
    // Actions
    handlePaymentAction,
    handleApprovePayment,
    handleRejectPayment,
    isProcessing
  } = useAdminPayments();

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
          paymentRequests={paymentRequests}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPaymentAction={handlePaymentAction}
        />
      </PageWrapper>
      
      <PaymentDialogs
        selectedPayment={selectedPayment}
        
        approveDialogOpen={approveDialogOpen}
        setApproveDialogOpen={setApproveDialogOpen}
        handleApprovePayment={handleApprovePayment}
        
        rejectDialogOpen={rejectDialogOpen}
        setRejectDialogOpen={setRejectDialogOpen}
        handleRejectPayment={handleRejectPayment}
        
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        
        isProcessing={isProcessing}
      />
      
      <PaymentNotifications refreshPayments={refreshPayments} />
    </>
  );
};

export default AdminPayments;
