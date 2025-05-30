
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { PaymentRequest } from '@/types/payment.types';
import { PaymentStatus } from '@/types/enums';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';
import { CheckCircle, XCircle, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentDetailsModalProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  canManage?: boolean;
  onStatusChange?: (paymentId: string, status: PaymentStatus, notes?: string, receiptFile?: File) => Promise<void>;
}

export const PaymentDetailsModal = ({
  payment,
  isOpen,
  onOpenChange,
  canManage = false,
  onStatusChange
}: PaymentDetailsModalProps) => {
  const [actionNotes, setActionNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileUpload = useFileUpload({
    bucket: 'payment-files',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxSizeInMB: 10
  });

  if (!payment) return null;

  const getStatusBadge = (status: PaymentStatus) => {
    const variants = {
      [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [PaymentStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
      [PaymentStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
      [PaymentStatus.PAID]: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const labels = {
      [PaymentStatus.PENDING]: 'Pendente',
      [PaymentStatus.APPROVED]: 'Aprovado',
      [PaymentStatus.REJECTED]: 'Rejeitado',
      [PaymentStatus.PAID]: 'Pago'
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleStatusChange = async (status: PaymentStatus) => {
    if (!onStatusChange) return;

    setIsProcessing(true);
    try {
      await onStatusChange(payment.id, status, actionNotes, receiptFile || undefined);
      setActionNotes('');
      setReceiptFile(null);
      onOpenChange(false);
      toast({
        title: "Status atualizado",
        description: `Pagamento ${status === PaymentStatus.APPROVED ? 'aprovado' : 'rejeitado'} com sucesso`
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detalhes do Pagamento
            {getStatusBadge(payment.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
              <p className="font-medium">{payment.client?.business_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
              <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
              <p className="font-medium">{payment.payment_type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Data da Solicitação</Label>
              <p className="font-medium">{formatDate(new Date(payment.created_at))}</p>
            </div>
          </div>

          {/* PIX Information */}
          {payment.payment_type === 'PIX' && payment.pix_key && (
            <div className="border rounded-lg p-4">
              <Label className="text-sm font-medium text-muted-foreground">Informações PIX</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Nome:</span>
                  <span className="text-sm font-medium">{payment.pix_key.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Titular:</span>
                  <span className="text-sm font-medium">{payment.pix_key.owner_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Chave:</span>
                  <span className="text-sm font-medium font-mono">{payment.pix_key.key}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tipo:</span>
                  <span className="text-sm font-medium">{payment.pix_key.type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Boleto Information */}
          {payment.payment_type === 'BOLETO' && (
            <div className="border rounded-lg p-4">
              <Label className="text-sm font-medium text-muted-foreground">Informações do Boleto</Label>
              <div className="mt-2 space-y-2">
                {payment.boleto_code && (
                  <div>
                    <span className="text-sm">Código:</span>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">{payment.boleto_code}</p>
                  </div>
                )}
                {payment.boleto_file_url && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Arquivo do boleto:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(payment.boleto_file_url!, 'boleto.pdf')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {payment.notes && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
              <p className="text-sm mt-1 p-3 bg-muted rounded">{payment.notes}</p>
            </div>
          )}

          {/* Receipt */}
          {payment.receipt_file_url && (
            <div className="border rounded-lg p-4">
              <Label className="text-sm font-medium text-muted-foreground">Comprovante</Label>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm">Comprovante de pagamento</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(payment.receipt_file_url!, 'comprovante.pdf')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <Label className="text-sm font-medium text-red-800">Motivo da Rejeição</Label>
              <p className="text-sm mt-1 text-red-700">{payment.rejection_reason}</p>
            </div>
          )}

          {/* Admin Actions */}
          {canManage && payment.status === PaymentStatus.PENDING && (
            <div className="border rounded-lg p-4 space-y-4">
              <Label className="text-sm font-medium">Ações do Administrador</Label>
              
              <div>
                <Label htmlFor="action-notes">Observações</Label>
                <Textarea
                  id="action-notes"
                  placeholder="Adicione observações sobre esta ação"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              <div>
                <Label>Comprovante (para aprovação)</Label>
                <FileUpload
                  onFileSelect={setReceiptFile}
                  onFileRemove={() => setReceiptFile(null)}
                  acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']}
                  maxSizeInMB={10}
                  currentFile={receiptFile || undefined}
                  isUploading={fileUpload.isUploading}
                  uploadProgress={fileUpload.uploadProgress}
                />
              </div>
            </div>
          )}
        </div>

        {canManage && payment.status === PaymentStatus.PENDING && (
          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => handleStatusChange(PaymentStatus.REJECTED)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeitar
            </Button>
            <Button
              onClick={() => handleStatusChange(PaymentStatus.APPROVED)}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
