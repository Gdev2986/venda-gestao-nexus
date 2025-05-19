
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  client_name?: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  client_id?: string;
}

interface AdminPaymentsListProps {
  payments: Payment[];
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
            <TableHead className="text-right">Valor</TableHead>
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
              <TableCell>{payment.client_name || `Cliente ${payment.client_id?.substring(0, 3)}`}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(payment.status)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(new Date(payment.created_at))}
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
                  
                  {payment.status === PaymentStatus.PENDING && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hidden sm:inline-flex"
                        onClick={() => onActionClick(payment.id, PaymentAction.APPROVE)}
                        title="Aprovar"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hidden sm:inline-flex"
                        onClick={() => onActionClick(payment.id, PaymentAction.REJECT)}
                        title="Rejeitar"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
