
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { Payment } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PaymentResponseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: Payment;
  isApproving: boolean;
  onApprove: (requestId: string, receiptUrl?: string) => void;
  onReject: (requestId: string, rejectionReason: string) => void;
}

export const PaymentResponseDialog = ({
  isOpen,
  onOpenChange,
  paymentRequest,
  isApproving,
  onApprove,
  onReject
}: PaymentResponseDialogProps) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (isApproving) {
        // In a real implementation, we would upload the receipt file to storage
        // and get the URL to pass to onApprove
        // For now, we'll just create a fake URL if a file was selected
        const receiptUrl = receiptFile 
          ? URL.createObjectURL(receiptFile)
          : undefined;
          
        await onApprove(paymentRequest.id, receiptUrl);
      } else {
        if (!rejectionReason.trim()) {
          alert("Por favor, informe um motivo para a rejeição.");
          return;
        }
        
        await onReject(paymentRequest.id, rejectionReason);
      }
    } finally {
      setIsSubmitting(false);
      // Reset form state
      setReceiptFile(null);
      setRejectionReason("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isApproving ? "Aprovar Solicitação" : "Rejeitar Solicitação"}
          </DialogTitle>
          <DialogDescription>
            {isApproving 
              ? "Aprove esta solicitação de pagamento e anexe o comprovante."
              : "Informe o motivo da rejeição desta solicitação de pagamento."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente</Label>
                <div className="font-medium">
                  {paymentRequest.client_name || "Cliente"}
                </div>
              </div>
              <div>
                <Label>Valor</Label>
                <div className="font-medium">
                  {formatCurrency(paymentRequest.amount)}
                </div>
              </div>
            </div>
            
            <div>
              <Label>Descrição</Label>
              <div className="text-sm text-muted-foreground">
                {paymentRequest.description || "Sem descrição"}
              </div>
            </div>
            
            {paymentRequest.payment_type === "PIX" && paymentRequest.pix_key && (
              <div className="grid gap-2">
                <Label>Chave PIX</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Tipo:</span> {paymentRequest.pix_key.type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Chave:</span> {paymentRequest.pix_key.key}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Nome:</span> {paymentRequest.pix_key.owner_name || "Não informado"}
                </div>
              </div>
            )}

            {isApproving ? (
              <div className="grid gap-2">
                <Label htmlFor="receipt">Comprovante de Pagamento</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    className="col-span-2"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant={receiptFile ? "default" : "outline"}
                    className="flex items-center justify-center gap-1"
                    disabled={!receiptFile}
                    onClick={() => setReceiptFile(null)}
                  >
                    {receiptFile ? (
                      <>
                        <X className="h-4 w-4" /> Limpar
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" /> Anexar
                      </>
                    )}
                  </Button>
                </div>
                {receiptFile && (
                  <div className="text-sm text-muted-foreground">
                    Arquivo selecionado: {receiptFile.name}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="rejection-reason">Motivo da Rejeição</Label>
                <Textarea 
                  id="rejection-reason"
                  placeholder="Informe o motivo da rejeição..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isApproving ? "default" : "destructive"}
            onClick={handleSubmit}
            disabled={isSubmitting || (!isApproving && !rejectionReason.trim())}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" />
            ) : isApproving ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {isApproving ? "Aprovar Pagamento" : "Rejeitar Pagamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
