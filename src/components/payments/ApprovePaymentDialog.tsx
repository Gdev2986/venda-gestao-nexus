
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
import { FileUploader } from "@/components/payments/FileUploader";
import { PaymentData } from "@/hooks/usePayments";

interface ApprovePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
  onApprove: (paymentId: string, receiptFile: File | null, notes: string) => Promise<void>;
  isProcessing: boolean;
}

export const ApprovePaymentDialog = ({
  open,
  onOpenChange,
  payment,
  onApprove,
  isProcessing,
}: ApprovePaymentDialogProps) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleApprove = async () => {
    if (payment) {
      await onApprove(payment.id, receiptFile, notes);
      setReceiptFile(null);
      setNotes("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReceiptFile(null);
    setNotes("");
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprovar Pagamento</DialogTitle>
          <DialogDescription>
            Faça upload do comprovante para aprovar o pagamento.
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
          
          <FileUploader
            label="Comprovante de pagamento (opcional)"
            onFileSelect={setReceiptFile}
            accept=".jpg,.jpeg,.png,.pdf"
            currentFile={null}
          />
          
          <Textarea
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            onClick={handleApprove}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Aprovar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
