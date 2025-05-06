import { Payment, PaymentStatus } from "@/types";
import { PaymentRequest } from "@/types/payment.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/payments/FileUploader";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Check, Clock, Download, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Create a union type that works with both Payment and PaymentRequest
type PaymentDetailType = Payment | PaymentRequest;

interface PaymentDetailViewProps {
  payment: PaymentDetailType;
  isLoading?: boolean;
  onApprove?: (paymentId: string, receiptFile: File | null, notes: string) => Promise<void>;
  onReject?: (paymentId: string, reason: string) => Promise<void>;
  isProcessing?: boolean;
}

// Export the component as a named export
export const PaymentDetailView = ({ 
  payment,
  isLoading = false,
  onApprove,
  onReject,
  isProcessing = false
}: PaymentDetailViewProps) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Helper function to handle PaymentStatus from both types
  const getStatusValue = (payment: PaymentDetailType): PaymentStatus => {
    return payment.status as unknown as PaymentStatus;
  };

  const getStatusBadge = (payment: PaymentDetailType) => {
    const status = getStatusValue(payment);
    
    switch (status) {
      case PaymentStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case PaymentStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Aprovado
          </Badge>
        );
      case PaymentStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1">
            <X className="h-3 w-3" />
            Recusado
          </Badge>
        );
      case PaymentStatus.PAID:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Pago
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formattedDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleApprove = async () => {
    if (onApprove) {
      await onApprove(payment.id, receiptFile, notes);
      setReceiptFile(null);
      setNotes("");
    }
  };

  const handleReject = async () => {
    if (onReject && rejectionReason.trim()) {
      await onReject(payment.id, rejectionReason);
      setRejectionReason("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 bg-muted animate-pulse rounded w-1/3 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalhes do Pagamento #{payment.id.substring(0, 8)}</CardTitle>
        {getStatusBadge(payment)}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Cliente</h3>
              <p className="text-lg font-medium">
                {'client' in payment && payment.client ? payment.client.business_name : payment.client_name || "N/A"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor</h3>
              <p className="text-lg font-medium">{formatCurrency(payment.amount)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Data da Solicitação</h3>
              <p>{formattedDate(payment.created_at)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Pagamento</h3>
              <p>{payment.payment_type || "PIX"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Chave PIX</h3>
              <p>{payment.pix_key?.key || "Não informada"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {'description' in payment && payment.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
                <p className="text-sm">{payment.description}</p>
              </div>
            )}
            
            {getStatusValue(payment) === PaymentStatus.APPROVED && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Data de Aprovação
                  </h3>
                  <p>{formattedDate(payment.approved_at)}</p>
                </div>
                
                {payment.receipt_url && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Comprovante
                    </h3>
                    <Button variant="outline" size="sm" asChild>
                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Baixar Comprovante
                      </a>
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {getStatusValue(payment) === PaymentStatus.REJECTED && payment.rejection_reason && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Motivo da Recusa
                </h3>
                <p className="text-sm text-red-600">{payment.rejection_reason}</p>
              </div>
            )}
            
            {getStatusValue(payment) === PaymentStatus.PENDING && onApprove && onReject && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Ações</h3>
                
                <div className="space-y-3">
                  <FileUploader
                    label="Comprovante de pagamento (opcional)"
                    onFileSelect={setReceiptFile}
                    accept=".jpg,.jpeg,.png,.pdf"
                    currentFile={null}
                  />
                  
                  <Textarea
                    placeholder="Observações para aprovação"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                  
                  <Button 
                    onClick={handleApprove}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar Pagamento
                  </Button>
                </div>
                
                <div className="space-y-3 mt-6">
                  <Textarea
                    placeholder="Motivo da recusa (obrigatório para recusar)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                  
                  <Button 
                    variant="destructive"
                    onClick={handleReject}
                    className="w-full"
                    disabled={isProcessing || !rejectionReason.trim()}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Recusar Pagamento
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Also export as default for backward compatibility
export default PaymentDetailView;
