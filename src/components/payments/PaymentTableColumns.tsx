
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentData } from "@/hooks/payments/payment.types";
import { PaymentStatus } from "@/types";

// Action types for payment operations
export type PaymentAction = 'approve' | 'reject' | 'details';

// Props for the createPaymentColumns function
interface PaymentColumnsProps {
  onPaymentAction: (payment: PaymentData, action: PaymentAction) => void;
}

// Function to create payment columns for the data table
export const createPaymentColumns = ({ onPaymentAction }: PaymentColumnsProps): ColumnDef<PaymentData>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.original.id.substring(0, 8)}</div>,
  },
  {
    accessorKey: "client_name",
    header: "Cliente",
    cell: ({ row }) => {
      // Safely access client property and ensure it's an object with business_name
      const client = row.original.client || {};
      // Use optional chaining to safely access business_name
      const clientName = client.business_name || "Cliente não especificado";
      return <div>{clientName}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "created_at",
    header: "Data da Solicitação",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      
      switch (status) {
        case PaymentStatus.PENDING:
          return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Pendente
            </Badge>
          );
        case PaymentStatus.APPROVED:
          return (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Aprovado
            </Badge>
          );
        case PaymentStatus.REJECTED:
          return (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Rejeitado
            </Badge>
          );
        case PaymentStatus.PAID:
          return (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              Pago
            </Badge>
          );
        default:
          return <Badge variant="outline">Desconhecido</Badge>;
      }
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const payment = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => onPaymentAction(payment, 'details')}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            
            {payment.status === PaymentStatus.PENDING && (
              <>
                <DropdownMenuItem onClick={() => onPaymentAction(payment, 'approve')}>
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onPaymentAction(payment, 'reject')}
                  className="text-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejeitar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
