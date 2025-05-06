
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { PaymentData } from "@/hooks/payments/payment.types";

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
  return (
    <>
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
