
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { DataTable } from "@/components/ui/data-table";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/routes/paths";
import { PaymentStatus } from "@/types";
import { usePayments, PaymentData } from "@/hooks/usePayments";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { createPaymentColumns, PaymentAction } from "@/components/payments/PaymentTableColumns";
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";

const Payments = () => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for modals
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the payments hook
  const { 
    payments, 
    isLoading, 
    fetchPayments, 
    approvePayment, 
    rejectPayment,
    currentPage,
    totalPages,
    setCurrentPage
  } = usePayments({
    statusFilter,
    searchTerm,
    fetchOnMount: true
  });

  // Set up real-time subscription for payments
  useEffect(() => {
    const channel = supabase
      .channel('payment_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPayments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPayments]);

  // Handle filter changes
  const handleFilterChange = (newStatusFilter: PaymentStatus | "ALL", newSearchTerm: string) => {
    setStatusFilter(newStatusFilter);
    setSearchTerm(newSearchTerm);
    fetchPayments();
  };

  // Handle payment actions
  const handlePaymentAction = (payment: PaymentData, action: PaymentAction) => {
    setSelectedPayment(payment);
    
    if (action === 'approve') {
      setApproveDialogOpen(true);
    } else if (action === 'reject') {
      setRejectDialogOpen(true);
    } else if (action === 'details') {
      setDetailsDialogOpen(true);
    }
  };

  // Handle payment approval with receipt upload
  const handleApprovePayment = async (paymentId: string, receiptFile: File | null, notes: string) => {
    setIsProcessing(true);
    
    try {
      let receiptUrl = null;
      
      // Upload receipt if provided
      if (receiptFile) {
        const fileName = `payment_${paymentId}_${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, receiptFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }
      
      await approvePayment(paymentId, receiptUrl);
      setApproveDialogOpen(false);
    } catch (error) {
      console.error('Error approving payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment rejection
  const handleRejectPayment = async (paymentId: string, rejectionReason: string) => {
    setIsProcessing(true);
    try {
      await rejectPayment(paymentId, rejectionReason);
      setRejectDialogOpen(false);
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate columns with the action handler
  const columns = createPaymentColumns({
    onPaymentAction: handlePaymentAction
  });

  return (
    <>
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie as solicitações de pagamento"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW}
      />

      <PaymentFilters
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        onFilterChange={handleFilterChange}
      />

      <PageWrapper>
        <DataTable 
          columns={columns} 
          data={payments}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PageWrapper>
      
      <ApprovePaymentDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        payment={selectedPayment}
        onApprove={handleApprovePayment}
        isProcessing={isProcessing}
      />
      
      <RejectPaymentDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        payment={selectedPayment}
        onReject={handleRejectPayment}
        isProcessing={isProcessing}
      />
      
      <PaymentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        payment={selectedPayment}
      />
    </>
  );
};

export default Payments;
