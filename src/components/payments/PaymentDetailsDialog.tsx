
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePaymentActions } from "@/hooks/payments/usePaymentActions";
import { PaymentStatus } from "@/types/enums";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/types/enums";
import { PaymentReceiptUploader } from "./PaymentReceiptUploader";
import { PaymentReceiptViewer } from "./PaymentReceiptViewer";

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentUpdated?: () => void;
}

export function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
  onPaymentUpdated,
}: PaymentDetailsDialogProps) {
  const { approvePayment, rejectPayment, isLoading } = usePaymentActions();
  const { toast } = useToast();
  const { user } = useUser();
  const [showReceiptUploader, setShowReceiptUploader] = useState(false);

  if (!payment) return null;

  const handleApprove = async () => {
    try {
      await approvePayment(payment.id);
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      onPaymentUpdated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o pagamento.",
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectPayment(payment.id);
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
      onPaymentUpdated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline">Pendente</Badge>;
      case "PROCESSING":
        return <Badge variant="secondary">Em processamento</Badge>;
      case "APPROVED":
        return <Badge variant="default">Aprovado</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "PAID":
        return <Badge variant="default">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'às' p", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const canApproveOrReject =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.FINANCIAL ||
    user?.role === UserRole.FINANCE;

  const isPending = payment.status === PaymentStatus.PENDING;
  const hasReceipt = !!payment.receipt_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="text-xl font-semibold">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <div>{getStatusBadge(payment.status)}</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Método</p>
              <p>{payment.payment_type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p>{formatDate(payment.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p>{payment.client?.business_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Referência</p>
              <p className="truncate">{payment.description || "N/A"}</p>
            </div>
          </div>

          {payment.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="whitespace-pre-wrap">{payment.description}</p>
              </div>
            </>
          )}

          {payment.rejection_reason && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Motivo da Rejeição</p>
                <p className="whitespace-pre-wrap">{payment.rejection_reason}</p>
              </div>
            </>
          )}

          {hasReceipt && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Comprovante</p>
                <PaymentReceiptViewer receiptUrl={payment.receipt_url!} />
              </div>
            </>
          )}

          {showReceiptUploader && (
            <>
              <Separator />
              <PaymentReceiptUploader
                paymentId={payment.id}
                onSuccess={() => {
                  setShowReceiptUploader(false);
                  onPaymentUpdated?.();
                }}
              />
            </>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            {canApproveOrReject && isPending && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Rejeitar"
                  )}
                </Button>
                <Button onClick={handleApprove} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Aprovar"
                  )}
                </Button>
              </>
            )}

            {payment.status === PaymentStatus.APPROVED && !hasReceipt && (
              <Button
                onClick={() => setShowReceiptUploader(true)}
                disabled={showReceiptUploader}
              >
                Anexar Comprovante
              </Button>
            )}

            {!showReceiptUploader && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
