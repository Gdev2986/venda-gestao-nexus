
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentRequest, Payment } from "@/types/payment.types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";

interface AdminPaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  onView: (payment: Payment) => void;
  onApprove?: (payment: Payment) => void;
  onReject?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
  onRefresh?: () => void;
}

export const AdminPaymentsList = ({ 
  payments, 
  isLoading, 
  onView,
  onApprove,
  onReject,
  onDelete,
  onRefresh
}: AdminPaymentsListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Carregando pagamentos...
              </TableCell>
            </TableRow>
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum pagamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.client?.business_name}</TableCell>
                <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  {payment.status === "PENDING" && (
                    <Badge variant="secondary">Pendente</Badge>
                  )}
                  {payment.status === "APPROVED" && (
                    <Badge className="bg-green-500 text-white">Aprovado</Badge>
                  )}
                  {payment.status === "REJECTED" && (
                    <Badge variant="destructive">Rejeitado</Badge>
                  )}
                  {payment.status === "PAID" && (
                    <Badge className="bg-blue-500 text-white">Pago</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onView(payment)}>
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
