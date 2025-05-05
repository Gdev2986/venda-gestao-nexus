
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar Pagamento</DialogTitle>
          <DialogDescription>
            Informe o motivo para rejeitar este pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
            placeholder="Motivo da rejeição"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
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
            {isProcessing ? "Processando..." : "Rejeitar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
