
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaymentData } from "@/hooks/payments/payment.types";
import { formatCurrency } from "@/lib/formatters";
import { ExternalLink, Download } from "lucide-react";
import { formatDate } from "@/components/payments/PaymentTableColumns";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/enums";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
}

// Função para determinar a cor baseada no status do pagamento
const getStatusColor = (status: PaymentStatus | string) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case PaymentStatus.PROCESSING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case PaymentStatus.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case PaymentStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case PaymentStatus.PAID:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Traduzir o status para exibição
const getStatusLabel = (status: PaymentStatus | string) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return "Pendente";
    case PaymentStatus.PROCESSING:
      return "Em Processamento";
    case PaymentStatus.APPROVED:
      return "Aprovado";
    case PaymentStatus.REJECTED:
      return "Recusado";
    case PaymentStatus.PAID:
      return "Pago";
    default:
      return status;
  }
};

export function PaymentDetailsDialog({
  open,
  onOpenChange,
  payment,
}: PaymentDetailsDialogProps) {
  if (!payment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
          <DialogDescription>
            Informações completas da solicitação de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
              <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
            </div>
            <Badge className={getStatusColor(payment.status)}>
              {getStatusLabel(payment.status)}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
              <p>{payment.client?.business_name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Data da Solicitação</h3>
              <p>{formatDate(payment.created_at)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
            <p className="text-sm">{payment.description || "Sem descrição"}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Informações de Pagamento</h3>
            
            {payment.pix_key && (
              <div className="bg-muted p-3 rounded-md mb-2">
                <p className="font-medium">PIX</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm">{payment.pix_key.key_type || payment.pix_key.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chave</p>
                    <p className="text-sm break-all">{payment.pix_key.key}</p>
                  </div>
                </div>
              </div>
            )}
            
            {payment.bank_info && (
              <div className="bg-muted p-3 rounded-md mb-2">
                <p className="font-medium">TED</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Banco</p>
                    <p className="text-sm">{payment.bank_info.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Agência</p>
                    <p className="text-sm">{payment.bank_info.branch_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conta</p>
                    <p className="text-sm">{payment.bank_info.account_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Titular</p>
                    <p className="text-sm">{payment.bank_info.account_holder}</p>
                  </div>
                </div>
              </div>
            )}

            {payment.document_url && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Boleto</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  asChild
                >
                  <a href={payment.document_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Boleto
                  </a>
                </Button>
              </div>
            )}
          </div>

          {payment.status === PaymentStatus.APPROVED && payment.approved_at && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Aprovado em</h3>
              <p>{formatDate(payment.approved_at)}</p>
            </div>
          )}

          {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Motivo da Recusa</h3>
              <p className="text-sm">{payment.rejection_reason}</p>
            </div>
          )}

          {payment.receipt_url && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Comprovante</h3>
              <Button 
                variant="outline" 
                className="mt-1"
                asChild
              >
                <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Comprovante
                </a>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
