
import { ApprovePaymentDialog } from "@/components/payments/ApprovePaymentDialog";
import { RejectPaymentDialog } from "@/components/payments/RejectPaymentDialog";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { PaymentData, BankInfo } from "@/types/payment.types";

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
    updated_at: selectedPayment.updated_at || selectedPayment.created_at, // Ensure updated_at is present
    // Ensure status is compatible with both systems by casting
    status: selectedPayment.status as any,
    // Make sure bank_info has all required fields if present
    bank_info: selectedPayment.bank_info ? {
      bank_name: selectedPayment.bank_info.bank_name || "",
      branch_number: selectedPayment.bank_info.branch_number || "",
      account_number: selectedPayment.bank_info.account_number || "",
      account_holder: selectedPayment.bank_info.account_holder || "",
      ...selectedPayment.bank_info
    } as BankInfo : undefined
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
