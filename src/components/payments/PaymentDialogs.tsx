
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { Payment } from "@/types/payment.types";

interface PaymentDialogsProps {
  selectedPayment: Payment | null;
  
  approveDialogOpen: boolean;
  setApproveDialogOpen: (open: boolean) => void;
  handleApprovePayment: (paymentId: string, receiptFile: File | null, notes: string) => Promise<void>;
  
  rejectDialogOpen: boolean;
  setRejectDialogOpen: (open: boolean) => void;
  handleRejectPayment: (paymentId: string, rejectionReason: string) => Promise<void>;
  
  detailsDialogOpen: boolean;
  setDetailsDialogOpen: (open: boolean) => void;
  
  isProcessing: boolean;
}

export const PaymentDialogs = ({
  selectedPayment,
  
  approveDialogOpen,
  setApproveDialogOpen,
  handleApprovePayment,
  
  rejectDialogOpen,
  setRejectDialogOpen,
  handleRejectPayment,
  
  detailsDialogOpen,
  setDetailsDialogOpen,
  
  isProcessing
}: PaymentDialogsProps) => {
  if (!selectedPayment) return null;
  
  // Convert selectedPayment to match the type expected by child components
  const paymentData: any = {
    ...selectedPayment,
    rejection_reason: selectedPayment.rejection_reason || null,
    pix_key: selectedPayment.pix_key ? {
      ...selectedPayment.pix_key,
      owner_name: selectedPayment.pix_key.owner_name || selectedPayment.pix_key.name || ''
    } : undefined
  };
  
  return (
    <>
      <ApprovePaymentDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        payment={paymentData}
        onApprove={handleApprovePayment}
        isProcessing={isProcessing}
      />
      
      <RejectPaymentDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        payment={paymentData}
        onReject={handleRejectPayment}
        isProcessing={isProcessing}
      />
      
      <PaymentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        payment={paymentData}
      />
    </>
  );
};
