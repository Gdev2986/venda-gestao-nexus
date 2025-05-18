
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { Payment, PaymentRequest } from "@/types/payment.types";

interface PaymentDialogsProps {
  selectedPayment: PaymentRequest | Payment | null;
  
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
  
  // Create compatible payment objects that satisfy both types
  const paymentForApproval = {
    ...selectedPayment,
    description: selectedPayment.description || ""
  } as PaymentRequest;
  
  const paymentForReject = {
    ...selectedPayment,
    description: selectedPayment.description || ""
  } as PaymentRequest;
  
  const paymentForDetails = {
    ...selectedPayment,
    rejection_reason: selectedPayment.rejection_reason || "",
    pix_key: selectedPayment.pix_key ? {
      ...selectedPayment.pix_key,
      owner_name: selectedPayment.pix_key.owner_name || selectedPayment.pix_key.name || ""
    } : undefined
  } as Payment;
  
  return (
    <>
      <ApprovePaymentDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        payment={paymentForApproval}
        onApprove={handleApprovePayment}
        isProcessing={isProcessing}
      />
      
      <RejectPaymentDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        payment={paymentForReject}
        onReject={handleRejectPayment}
        isProcessing={isProcessing}
      />
      
      <PaymentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        payment={paymentForDetails}
      />
    </>
  );
};
