
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PaymentRequest } from '@/types/payment.types';
import { PaymentStatus } from '@/types/enums';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/formatters';
import { CheckCircle, XCircle, Upload } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

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
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | undefined>();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!payment) return null;

  const handleStatusChange = async (status: PaymentStatus) => {
    if (!onStatusChange) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(payment.id, status, notes, receiptFile);
      onOpenChange(false);
      setNotes('');
      setReceiptFile(undefined);
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge className="bg-blue-100 text-blue-800">Pago</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID</Label>
              <p className="font-mono text-sm">{payment.id.substring(0, 8)}...</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="mt-1">{getStatusBadge(payment.status)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
              <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
              <p>{payment.payment_type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
              <p>{payment.client?.business_name || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
              <p>{formatDate(new Date(payment.created_at))}</p>
            </div>
          </div>

          {/* PIX Key Info */}
          {payment.payment_type === 'PIX' && payment.pix_key && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Chave PIX</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{payment.pix_key.name}</p>
                <p className="text-sm text-muted-foreground">{payment.pix_key.key}</p>
                <p className="text-sm text-muted-foreground">Tipo: {payment.pix_key.type}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {payment.notes && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{payment.notes}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Motivo da Rejeição</Label>
              <p className="mt-1 p-3 bg-red-50 rounded-lg text-red-800">{payment.rejection_reason}</p>
            </div>
          )}

          {/* Management Section for Admins */}
          {canManage && payment.status === PaymentStatus.PENDING && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Gerenciar Pagamento</h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Adicione observações sobre o processamento..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Comprovante (opcional)</Label>
                  <FileUpload
                    onFileSelect={setReceiptFile}
                    onFileRemove={() => setReceiptFile(undefined)}
                    acceptedTypes={['image/*', 'application/pdf']}
                    maxSizeInMB={5}
                    currentFile={receiptFile}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusChange(PaymentStatus.APPROVED)}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(PaymentStatus.REJECTED)}
                    disabled={isUpdating}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Section */}
          {payment.receipt_file_url && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Comprovante</Label>
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={payment.receipt_file_url} target="_blank" rel="noopener noreferrer">
                    <Upload className="h-4 w-4 mr-2" />
                    Ver Comprovante
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
