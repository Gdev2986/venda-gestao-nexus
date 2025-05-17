
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { PaymentData } from "@/types/payment.types";

interface PaymentDialogsProps {
  selectedPayment: PaymentData | null;
  
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
  // Ensure that we always have a description field that's not undefined
  // Convert our selectedPayment to the correct type with all required fields
  const payment = selectedPayment ? {
    ...selectedPayment,
    description: selectedPayment.description || "",
    // Ensure status is compatible with both systems by casting
    status: selectedPayment.status as any
  } : null;
  
  return (
    <>
      <ApprovePaymentDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        payment={payment}
        onApprove={handleApprovePayment}
        isProcessing={isProcessing}
      />
      
      <RejectPaymentDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        payment={payment}
        onReject={handleRejectPayment}
        isProcessing={isProcessing}
      />
      
      <PaymentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        payment={payment}
      />
    </>
  );
};
