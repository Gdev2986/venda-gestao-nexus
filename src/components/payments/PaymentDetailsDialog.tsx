
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { PaymentData } from "@/hooks/usePayments";
import { PaymentStatus } from "@/types";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentData | null;
}

export const PaymentDetailsDialog = ({
  open,
  onOpenChange,
  payment,
}: PaymentDetailsDialogProps) => {
  if (!payment) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">ID do Pagamento</p>
              <p className="text-sm font-mono">{payment.id.substring(0, 8)}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <div>
                {payment.status === PaymentStatus.PENDING && (
                  <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                )}
                {payment.status === PaymentStatus.APPROVED && (
                  <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                )}
                {payment.status === PaymentStatus.REJECTED && (
                  <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
                )}
                {payment.status === PaymentStatus.PAID && (
                  <Badge className="bg-blue-100 text-blue-800">Pago</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Informações do Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Nome</p>
                <p className="text-sm">{payment.client?.business_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p className="text-sm">{payment.client?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Detalhes do Pagamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Valor</p>
                <p className="text-sm">{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Data da Solicitação</p>
                <p className="text-sm">{formatDate(payment.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Tipo de Chave</p>
                <p className="text-sm">{payment.pix_key?.type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Chave PIX</p>
                <p className="text-sm">{payment.pix_key?.key || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {payment.description && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-sm">{payment.description}</p>
            </div>
          )}
          
          {payment.status === PaymentStatus.APPROVED && payment.approved_at && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Aprovação</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Data de Aprovação</p>
                  <p className="text-sm">{formatDate(payment.approved_at)}</p>
                </div>
                {payment.receipt_url && (
                  <div>
                    <p className="text-sm font-medium mb-1">Comprovante</p>
                    <Button size="sm" variant="outline" asChild>
                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                        Ver Comprovante
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Rejeição</h3>
              <p className="text-sm">{payment.rejection_reason}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
