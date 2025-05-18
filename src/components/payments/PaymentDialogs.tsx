
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { Payment } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";

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
  return (
    <>
      {selectedPayment && (
        <>
          <ApprovePaymentDialog
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            payment={selectedPayment as any} // Cast for type compatibility
            onApprove={handleApprovePayment}
            isProcessing={isProcessing}
          />
          
          <RejectPaymentDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            payment={selectedPayment as any} // Cast for type compatibility
            onReject={handleRejectPayment}
            isProcessing={isProcessing}
          />
          
          <PaymentDetailsDialog
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            payment={selectedPayment}
          />
        </>
      )}
    </>
  );
};
