
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
import { Loader2, Upload } from "lucide-react";
import { PaymentDetailView } from "./PaymentDetailView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SendReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
  onSendReceipt: (paymentId: string, receiptFile: File, message: string) => Promise<void>;
  isProcessing: boolean;
}

export function SendReceiptDialog({
  open,
  onOpenChange,
  payment,
  onSendReceipt,
  isProcessing
}: SendReceiptDialogProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendReceipt = async () => {
    if (!payment) return;

    if (!receiptFile) {
      setError("Por favor, selecione um arquivo de comprovante.");
      return;
    }

    setError(null);
    await onSendReceipt(payment.id, receiptFile, message);
    setReceiptFile(null);
    setMessage("");
  };

  // Resetar formulário quando o diálogo abre/fecha
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReceiptFile(null);
      setMessage("");
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Comprovante</DialogTitle>
          <DialogDescription>
            Envie um comprovante de pagamento para o cliente referente ao pagamento de{" "}
            {payment ? formatCurrency(payment.amount) : ""}
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <PaymentDetailView payment={payment} />
        )}

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="receipt-file" className="text-primary">
              Comprovante de Pagamento *
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="receipt-file"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setReceiptFile(file);
                    setError(null);
                  }
                }}
                className="flex-1"
              />
              {receiptFile && (
                <div className="text-sm text-muted-foreground">
                  {receiptFile.name}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="receipt-message">
              Mensagem para o Cliente
            </Label>
            <Textarea
              id="receipt-message"
              placeholder="Digite uma mensagem para acompanhar o comprovante (opcional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleSendReceipt} 
            disabled={isProcessing || !payment || !receiptFile}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Comprovante
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
