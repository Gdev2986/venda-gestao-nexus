
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { PaymentRequest, PaymentType } from "@/types/payment.types";
import { Eye, CheckCircle, XCircle, FileText, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminPaymentsListProps {
  payments: PaymentRequest[];
  isLoading: boolean;
  selectedStatus: PaymentStatus | "ALL";
  onActionClick: (paymentId: string, action: PaymentAction) => void;
}

// Helper function to get badge color based on status
const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.APPROVED:
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Aprovado
        </Badge>
      );
    case PaymentStatus.REJECTED:
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Rejeitado
        </Badge>
      );
    case PaymentStatus.PAID:
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Pago
        </Badge>
      );
    case PaymentStatus.PENDING:
    default:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pendente
        </Badge>
      );
  }
};

const getPaymentTypeIcon = (type: PaymentType) => {
  switch (type) {
    case 'PIX':
      return <CreditCard className="h-4 w-4 text-green-600" />;
    case 'BOLETO':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'TED':
      return <CreditCard className="h-4 w-4 text-purple-600" />;
    default:
      return <CreditCard className="h-4 w-4 text-gray-600" />;
  }
};

const getPaymentTypeLabel = (type: PaymentType) => {
  const labels = {
    'PIX': 'PIX',
    'BOLETO': 'Boleto',
    'TED': 'TED'
  };
  return labels[type] || type;
};

export function AdminPaymentsList({
  payments,
  isLoading,
  selectedStatus,
  onActionClick,
}: AdminPaymentsListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando pagamentos...</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum pagamento encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Saldo Cliente</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs">
                {payment.id.substring(0, 8)}...
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {payment.client?.business_name || `Cliente ${payment.client_id?.substring(0, 8)}`}
                  </div>
                  {payment.payment_type === 'PIX' && payment.pix_key && (
                    <div className="text-xs text-muted-foreground">
                      {payment.pix_key.name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPaymentTypeIcon(payment.payment_type)}
                  <span className="text-sm">{getPaymentTypeLabel(payment.payment_type)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {payment.client?.current_balance !== undefined 
                    ? formatCurrency(payment.client.current_balance)
                    : '-'
                  }
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(payment.status)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-sm">
                  {formatDate(new Date(payment.created_at))}
                </div>
                {payment.payment_type === 'PIX' && payment.pix_key && (
                  <div className="text-xs text-muted-foreground">
                    {payment.pix_key.key}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onActionClick(payment.id, PaymentAction.VIEW)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
