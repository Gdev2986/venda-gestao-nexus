import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment, PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface ColumnDef<TData = any, TValue = any> {
  accessorKey?: keyof TData;
  header?: string | ((props: { column: ColumnDef<TData, TValue> }) => React.ReactNode);
  cell?: (props: { row: TData }) => React.ReactNode;
  footer?: string | ((props: { column: ColumnDef<TData, TValue> }) => React.ReactNode);
}

// Function to determine the color based on payment status
const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PaymentStatus.APPROVED:
      return "bg-green-100 text-green-800";
    case PaymentStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case PaymentStatus.PAID:
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Function to format the date
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data inválida";
  }
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

// Function to get client name safely
export const getPaymentClientName = (payment: any): string => {
  // Safety check for client object and properties
  if (payment.client && typeof payment.client === 'object') {
    return payment.client.business_name || payment.client.company_name || 'Cliente';
  }
  
  // Fallback to client_name property or default value
  return payment.client_name || 'Cliente';
};

const PaymentTableColumns = () => {
  const { toast } = useToast();
  const [copiedPaymentId, setCopiedPaymentId] = useState<string | null>(null);

  const copyToClipboard = (text: string, paymentId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPaymentId(paymentId);
    toast({
      title: "Copiado para área de transferência",
      description: "O ID do pagamento foi copiado com sucesso.",
    });
    setTimeout(() => {
      setCopiedPaymentId(null);
    }, 3000);
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "ID do Pagamento",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.id}</span>
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-4 h-4", copiedPaymentId === row.id ? "text-green-500" : "")}
            onClick={() => copyToClipboard(row.id, row.id)}
            disabled={copiedPaymentId === row.id}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Data de Criação",
      cell: ({ row }) => <div>{formatDate(row.created_at)}</div>,
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => <div>{formatCurrency(row.amount)}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => <div>{getPaymentClientName(row)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Visualizar Detalhes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
};

export default PaymentTableColumns;
