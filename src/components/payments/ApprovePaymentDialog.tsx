
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
import { PaymentDetailView } from "./PaymentDetailView";
import { PaymentData } from "@/hooks/payments/payment.types";
import { formatCurrency } from "@/lib/formatters";
import { Loader2 } from "lucide-react";

// Create a simplified PaymentReceiptUploader component
export function PaymentReceiptUploader({ 
  onFileSelected, 
  selectedFile 
}: { 
  onFileSelected: (file: File | null) => void; 
  selectedFile: File | null;
}) {
  return (
    <div className="mt-2">
      <input
        type="file"
        className="w-full"
        onChange={(e) => onFileSelected(e.target.files ? e.target.files[0] : null)}
        accept="image/*,.pdf"
      />
      {selectedFile && (
        <p className="text-sm mt-1 text-muted-foreground">
          Arquivo selecionado: {selectedFile.name}
        </p>
      )}
    </div>
  );
}

interface ApprovePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
  onApprove: (paymentId: string, receiptFile: File | null, notes: string) => Promise<void>;
  isProcessing: boolean;
}

export function ApprovePaymentDialog({
  open,
  onOpenChange,
  payment,
  onApprove,
  isProcessing
}: ApprovePaymentDialogProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleApprove = async () => {
    if (!payment) return;

    await onApprove(payment.id, receiptFile, notes);
    setReceiptFile(null);
    setNotes("");
  };

  // Reset form when dialog opens/closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReceiptFile(null);
      setNotes("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar Pagamento</DialogTitle>
          <DialogDescription>
            Revise os detalhes antes de aprovar o pagamento de{" "}
            {payment ? formatCurrency(payment.amount) : ""}
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <PaymentDetailView payment={payment} />
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="receipt">Comprovante de Pagamento (opcional)</Label>
            <PaymentReceiptUploader
              onFileSelected={setReceiptFile}
              selectedFile={receiptFile}
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre este pagamento"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleApprove} 
            disabled={isProcessing || !payment}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando
              </>
            ) : (
              "Aprovar Pagamento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
