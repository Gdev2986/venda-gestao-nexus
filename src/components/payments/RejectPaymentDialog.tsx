
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { PaymentData } from "@/hooks/usePayments";

interface RejectPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
  onReject: (paymentId: string, rejectionReason: string) => Promise<void>;
  isProcessing: boolean;
}

export const RejectPaymentDialog = ({
  open,
  onOpenChange,
  payment,
  onReject,
  isProcessing,
}: RejectPaymentDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = async () => {
    if (payment && rejectionReason.trim()) {
      await onReject(payment.id, rejectionReason);
      setRejectionReason("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRejectionReason("");
  };

  if (!payment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rejeitar Pagamento</AlertDialogTitle>
          <AlertDialogDescription>
            Informe o motivo para rejeitar este pagamento. Esta informação será enviada ao cliente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p className="text-sm">{payment.client?.business_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Valor</p>
            <p className="text-sm">{formatCurrency(payment.amount)}</p>
          </div>
        </div>
        
        <Textarea
          placeholder="Motivo da rejeição *"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="min-h-[100px]"
        />
        
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isProcessing || !rejectionReason.trim()}
          >
            Rejeitar Pagamento
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
