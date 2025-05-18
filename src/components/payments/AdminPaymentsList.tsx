
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Trash, Send } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { Payment } from "@/types/payment.types";

interface AdminPaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  selectedStatus: PaymentStatus | "ALL";
  onActionClick: (paymentId: string, action: PaymentAction) => void;
}

export const AdminPaymentsList: React.FC<AdminPaymentsListProps> = ({
  payments,
  isLoading,
  selectedStatus,
  onActionClick,
}) => {
  if (isLoading) {
    return <div className="py-8 text-center">Carregando pagamentos...</div>;
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="py-8 text-center">
        Nenhum pagamento encontrado{" "}
        {selectedStatus !== "ALL" && `com o status ${selectedStatus}`}.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs">
                {payment.id.substring(0, 8)}
              </TableCell>
              <TableCell>
                {payment.client?.business_name || "Cliente não informado"}
              </TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={payment.status} />
              </TableCell>
              <TableCell>{formatDate(new Date(payment.created_at))}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onActionClick(payment.id, PaymentAction.VIEW)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {payment.status === PaymentStatus.PENDING && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onActionClick(payment.id, PaymentAction.APPROVE)
                        }
                        title="Aprovar"
                        className="text-green-500 hover:text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onActionClick(payment.id, PaymentAction.REJECT)
                        }
                        title="Rejeitar"
                        className="text-red-500 hover:text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {payment.status === PaymentStatus.APPROVED && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onActionClick(payment.id, PaymentAction.SEND_RECEIPT)
                      }
                      title="Enviar Comprovante"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onActionClick(payment.id, PaymentAction.DELETE)}
                    title="Excluir"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper component for payment status display
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = "default";
  let label = "";

  switch (status) {
    case PaymentStatus.PENDING:
      variant = "outline";
      label = "Pendente";
      break;
    case PaymentStatus.APPROVED:
      variant = "secondary";
      label = "Aprovado";
      break;
    case PaymentStatus.PAID:
      variant = "default";
      label = "Pago";
      break;
    case PaymentStatus.REJECTED:
      variant = "destructive";
      label = "Rejeitado";
      break;
    default:
      variant = "outline";
      label = status;
  }

  return <Badge variant={variant}>{label}</Badge>;
};
