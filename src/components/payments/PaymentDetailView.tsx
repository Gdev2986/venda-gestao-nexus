
import { formatCurrency } from "@/lib/formatters";
import { formatDate } from "@/lib/formatters";
import { PaymentData } from "@/hooks/payments/payment.types";
import { Badge } from "@/components/ui/badge";

interface PaymentDetailViewProps {
  payment: PaymentData;
}

export function PaymentDetailView({ payment }: PaymentDetailViewProps) {
  const renderStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "approved" || statusLower === "paid") {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
    } else if (statusLower === "rejected") {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
    } else {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div>{renderStatusBadge(payment.status)}</div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Valor</p>
          <p className="text-xl font-semibold">{formatCurrency(payment.amount)}</p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Cliente</p>
        <p className="font-medium">
          {payment.client?.business_name || "Cliente não especificado"}
        </p>
      </div>

      {payment.description && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Descrição</p>
          <p>{payment.description}</p>
        </div>
      )}

      {payment.pix_key && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Chave PIX</p>
          <p className="font-mono text-sm p-2 bg-muted rounded overflow-auto">
            {payment.pix_key.key}
          </p>
          <p className="text-xs text-muted-foreground">
            {payment.pix_key.owner_name || payment.pix_key.name || "Proprietário não especificado"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Data de criação</p>
          <p>{formatDate(new Date(payment.created_at))}</p>
        </div>

        {payment.approved_at && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Data de aprovação
            </p>
            <p>{formatDate(new Date(payment.approved_at))}</p>
          </div>
        )}
      </div>

      {payment.rejection_reason && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-500">Motivo da rejeição</p>
          <p className="text-sm bg-red-50 p-2 rounded">{payment.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}
