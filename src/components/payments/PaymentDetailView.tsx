
import { formatCurrency } from "@/lib/utils";
import { PaymentData } from "@/hooks/payments/payment.types";
import { Badge } from "@/components/ui/badge";

interface PaymentDetailViewProps {
  payment: PaymentData;
}

// Simple date formatter function that accepts strings or Date objects
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

export function PaymentDetailView({ payment }: PaymentDetailViewProps) {
  return (
    <div className="space-y-4 my-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Cliente</p>
          <p className="font-medium">{payment.client?.business_name || 'Cliente não identificado'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Valor</p>
          <p className="font-medium">{formatCurrency(payment.amount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Data da solicitação</p>
          <p className="font-medium">{formatDate(payment.created_at)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <StatusBadge status={payment.status} />
        </div>
        
        {payment.description && (
          <div className="col-span-2">
            <p className="text-muted-foreground">Descrição</p>
            <p className="font-medium">{payment.description}</p>
          </div>
        )}
        
        {payment.approved_at && (
          <div className="col-span-2">
            <p className="text-muted-foreground">Aprovado em</p>
            <p className="font-medium">{formatDate(payment.approved_at)}</p>
          </div>
        )}
        
        {payment.rejection_reason && (
          <div className="col-span-2">
            <p className="text-muted-foreground">Motivo da rejeição</p>
            <p className="font-medium">{payment.rejection_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusLower = String(status).toLowerCase();
  
  switch (statusLower) {
    case 'approved':
      return <Badge className="bg-green-500">Aprovado</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejeitado</Badge>;
    case 'paid':
      return <Badge className="bg-blue-500">Pago</Badge>;
    default:
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>;
  }
}
