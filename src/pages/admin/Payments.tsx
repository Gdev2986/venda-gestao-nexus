
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
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
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { PageWrapper } from "@/components/page/PageWrapper";
import { useToast } from "@/hooks/use-toast";

const AdminPayments = () => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for modals
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Use the payments hook
  const { 
    paymentRequests, 
    isLoading, 
    refreshPayments, 
    approvePayment, 
    rejectPayment,
    currentPage,
    totalPages,
    setCurrentPage
  } = usePayments({
    statusFilter,
    searchTerm
  });

  // Set up real-time subscription for admin (listens to all payment changes)
  usePaymentSubscription(refreshPayments, { 
    notifyUser: true 
  });

  // Handle filter changes
  const handleFilterChange = (newStatusFilter: PaymentStatus | "ALL", newSearchTerm: string) => {
    setStatusFilter(newStatusFilter);
    setSearchTerm(newSearchTerm);
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

  // Listen for notifications from the database
  useEffect(() => {
    const notificationsChannel = supabase
      .channel('notifications_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: "type=eq.PAYMENT_REQUEST"
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          toast({
            title: payload.new.title || "Nova solicitação de pagamento",
            description: payload.new.message || "Um cliente enviou uma nova solicitação de pagamento"
          });
          
          // Refresh payment requests
          refreshPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [toast, refreshPayments]);

  return (
    <>
      <PageHeader 
        title="Payments" 
        description="Manage payment requests"
        actionLabel="New Payment"
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
          data={paymentRequests}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
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

export default AdminPayments;
