
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentData } from "@/hooks/payments/payment.types";
import { formatCurrency } from "@/lib/formatters";
import { Loader2 } from "lucide-react";
import { PaymentDetailView } from "./PaymentDetailView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface RejectPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
  onReject: (paymentId: string, rejectionReason: string) => Promise<void>;
  isProcessing: boolean;
}

export function RejectPaymentDialog({
  open,
  onOpenChange,
  payment,
  onReject,
  isProcessing
}: RejectPaymentDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleReject = async () => {
    if (!payment) return;

    if (!rejectionReason.trim()) {
      setError("Por favor, informe o motivo da rejeição.");
      return;
    }

    setError(null);
    await onReject(payment.id, rejectionReason);
    setRejectionReason("");
  };

  // Reset form when dialog opens/closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setRejectionReason("");
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeitar Pagamento</DialogTitle>
          <DialogDescription>
            Informe o motivo da rejeição do pagamento de{" "}
            {payment ? formatCurrency(payment.amount) : ""}
          </DialogDescription>
        </DialogHeader>

        {payment && <PaymentDetailView payment={payment} />}

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="rejection-reason" className="text-red-500">
              Motivo da Rejeição *
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Explique por que este pagamento está sendo rejeitado"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError(null);
              }}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleReject} 
            disabled={isProcessing || !payment}
            variant="destructive"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando
              </>
            ) : (
              "Rejeitar Pagamento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
