
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/payments/FileUploader";
import { Payment } from "@/types/payment.types";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Label } from '@/components/ui/label';

export interface SendReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  onSend: (paymentId: string, receiptFile: File, message: string) => Promise<void>;
  isProcessing: boolean;
}

export function SendReceiptDialog({
  open,
  onOpenChange,
  payment,
  onSend,
  isProcessing
}: SendReceiptDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!file) return;
    
    setIsSending(true);
    try {
      await onSend(payment.id, file, message);
      setFile(null);
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending receipt:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Comprovante</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cliente</span>
              <span className="font-medium">{payment.client?.business_name || 'Cliente'}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receipt">Comprovante</Label>
            <FileUploader 
              id="receipt"
              onFileSelect={setFile} 
              selectedFile={file}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Adicione uma observação..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end pt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending || isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={!file || isSending || isProcessing}
            >
              {isSending || isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Comprovante"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
