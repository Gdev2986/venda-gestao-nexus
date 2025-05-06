
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePayments, PaymentData } from "@/hooks/usePayments";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { PaymentStatus } from "@/types";
import { PaymentAction } from "@/components/payments/PaymentTableColumns";

export const useAdminPayments = () => {
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

  return {
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
  };
};
