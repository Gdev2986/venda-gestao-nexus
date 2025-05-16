
import { Payment, PaymentStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/components/payments/PaymentTableColumns';
import { PaymentAction, PaymentStatus as EnumPaymentStatus } from '@/types/enums';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Send, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentListTableProps {
  payments: Payment[];
  selectedPayments: string[];
  onSelectPayment: (paymentId: string) => void;
  onSelectAllPayments: () => void;
  onAction: (paymentId: string, action: PaymentAction) => void;
}

// Função para determinar a cor baseada no status do pagamento
const getStatusColor = (status: PaymentStatus | string) => {
  switch (status) {
    case EnumPaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case EnumPaymentStatus.PROCESSING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case EnumPaymentStatus.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case EnumPaymentStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case EnumPaymentStatus.PAID:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Traduzir o status para exibição
const getStatusLabel = (status: PaymentStatus | string) => {
  switch (status) {
    case EnumPaymentStatus.PENDING:
      return "Pendente";
    case EnumPaymentStatus.PROCESSING:
      return "Em Processamento";
    case EnumPaymentStatus.APPROVED:
      return "Aprovado";
    case EnumPaymentStatus.REJECTED:
      return "Recusado";
    case EnumPaymentStatus.PAID:
      return "Pago";
    default:
      return status;
  }
};

export const PaymentListTable = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAllPayments,
  onAction,
}: PaymentListTableProps) => {
  const handleStatusChange = (paymentId: string, newStatus: string) => {
    if (newStatus === EnumPaymentStatus.APPROVED) {
      onAction(paymentId, PaymentAction.APPROVE);
    } else if (newStatus === EnumPaymentStatus.REJECTED) {
      onAction(paymentId, PaymentAction.REJECT);
    } else if (newStatus === EnumPaymentStatus.PAID) {
      onAction(paymentId, PaymentAction.APPROVE);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedPayments.length === payments.length && payments.length > 0}
                onChange={onSelectAllPayments}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const isPending = payment.status === EnumPaymentStatus.PENDING || payment.status === EnumPaymentStatus.PROCESSING;
            const isApproved = payment.status === EnumPaymentStatus.APPROVED || payment.status === EnumPaymentStatus.PAID;
            
            return (
              <TableRow key={payment.id} className="hover:bg-muted/50">
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => onSelectPayment(payment.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {payment.client?.business_name || payment.client_name || 'N/A'}
                  </div>
                  {payment.client?.balance !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      Saldo: {formatCurrency(payment.client.balance)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {payment.amount ? formatCurrency(payment.amount) : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusLabel(payment.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {payment.created_at ? formatDate(payment.created_at) : 'N/A'}
                </TableCell>
                <TableCell className="text-sm">
                  {payment.pix_key ? (
                    <span className="text-xs">
                      PIX: {payment.pix_key.key.substring(0, 10)}...
                    </span>
                  ) : payment.bank_info ? (
                    <span className="text-xs">
                      TED: {payment.bank_info.bank_name}
                    </span>
                  ) : payment.document_url ? (
                    <span className="text-xs">
                      Boleto
                    </span>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAction(payment.id, PaymentAction.VIEW)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalhes</span>
                    </Button>
                    
                    {isApproved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAction(payment.id, PaymentAction.SEND_RECEIPT)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Enviar comprovante</span>
                      </Button>
                    )}
                    
                    {isPending && (
                      <Select 
                        onValueChange={(value) => handleStatusChange(payment.id, value)}
                        defaultValue={payment.status}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue placeholder="Alterar status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EnumPaymentStatus.APPROVED}>Aprovar</SelectItem>
                          <SelectItem value={EnumPaymentStatus.REJECTED}>Recusar</SelectItem>
                          <SelectItem value={EnumPaymentStatus.PAID}>Pago</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mais ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction(payment.id, PaymentAction.VIEW)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        {isPending && (
                          <>
                            <DropdownMenuItem onClick={() => onAction(payment.id, PaymentAction.APPROVE)}>
                              Aprovar pagamento
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(payment.id, PaymentAction.REJECT)}>
                              Recusar pagamento
                            </DropdownMenuItem>
                          </>
                        )}
                        {isApproved && (
                          <DropdownMenuItem onClick={() => onAction(payment.id, PaymentAction.SEND_RECEIPT)}>
                            Enviar comprovante
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
