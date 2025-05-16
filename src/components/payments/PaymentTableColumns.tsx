
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown, Copy, Eye, Send, Download, Check, X, MoreHorizontal } from "lucide-react";
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
import { PaymentAction } from "@/types/enums";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface ColumnDef<TData = any, TValue = any> {
  id?: string;
  accessorKey?: keyof TData;
  header?: string | ((props: { column: ColumnDef<TData, TValue> }) => React.ReactNode);
  cell?: (props: { row: TData }) => React.ReactNode;
  footer?: string | ((props: { column: ColumnDef<TData, TValue> }) => React.ReactNode);
}

// Função para determinar a cor baseada no status do pagamento
const getStatusColor = (status: PaymentStatus | string) => {
  switch (status) {
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case PaymentStatus.PROCESSING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case PaymentStatus.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case PaymentStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case PaymentStatus.PAID:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Função para formatar a data
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

// Função para formatar moeda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

// Função para obter o nome do cliente com segurança
export const getPaymentClientName = (payment: any): string => {
  // Verificação de segurança para o objeto cliente e propriedades
  if (payment.client && typeof payment.client === 'object') {
    return payment.client.business_name || payment.client.company_name || 'Cliente';
  }
  
  // Fallback para propriedade client_name ou valor padrão
  return payment.client_name || 'Cliente';
};

export const createPaymentColumns = (onActionClick: (paymentId: string, action: PaymentAction) => void) => {
  const [copiedPaymentId, setCopiedPaymentId] = useState<string | null>(null);
  const { toast } = useToast();

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
      id: "id",
      accessorKey: "id",
      header: "ID do Pagamento",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs">{row.id.substring(0, 8)}...</span>
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
      id: "client_name",
      accessorKey: "client_name",
      header: "Cliente",
      cell: ({ row }) => {
        const payment = row;
        const clientName = payment.client?.business_name || payment.client_name || 'N/A';
        const clientBalance = payment.client?.balance ? formatCurrency(payment.client.balance) : 'Saldo não disponível';
        
        return (
          <div>
            <div className="font-medium">{clientName}</div>
            <div className="text-xs text-muted-foreground">Saldo: {clientBalance}</div>
          </div>
        );
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Data da Solicitação",
      cell: ({ row }) => <div>{formatDate(row.created_at)}</div>,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => <div className="font-medium">{formatCurrency(row.amount)}</div>,
    },
    {
      id: "pix_key",
      accessorKey: "pix_key",
      header: "Método de Pagamento",
      cell: ({ row }) => {
        if (row.pix_key) {
          return (
            <div>
              <div className="font-medium">PIX</div>
              <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                {row.pix_key.key_type || row.pix_key.type}: {row.pix_key.key}
              </div>
            </div>
          );
        } else if (row.payment_type === 'TED') {
          return (
            <div>
              <div className="font-medium">TED</div>
              <div className="text-xs text-muted-foreground">
                {row.bank_info?.bank_name || 'Banco'}: {row.bank_info?.account_number || 'N/A'}
              </div>
            </div>
          );
        } else if (row.payment_type === 'BOLETO') {
          return (
            <div className="flex items-center">
              <div className="font-medium mr-2">Boleto</div>
              {row.document_url && (
                <Button size="sm" variant="outline" asChild className="h-6 px-2">
                  <a href={row.document_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3 w-3 mr-1" />
                    <span className="text-xs">Baixar</span>
                  </a>
                </Button>
              )}
            </div>
          );
        }
        return <div>Não especificado</div>;
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.status as PaymentStatus | string)}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const isPending = row.status === PaymentStatus.PENDING || row.status === PaymentStatus.PROCESSING;
        const isApproved = row.status === PaymentStatus.APPROVED || row.status === PaymentStatus.PAID;
        
        return (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => onActionClick(row.id, PaymentAction.VIEW)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
            
            {isPending && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 px-2 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={() => onActionClick(row.id, PaymentAction.APPROVE)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Aprovar
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  onClick={() => onActionClick(row.id, PaymentAction.REJECT)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Recusar
                </Button>
              </>
            )}
            
            {isApproved && (
              <Button 
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onActionClick(row.id, PaymentAction.SEND_RECEIPT)}
              >
                <Send className="h-3 w-3 mr-1" />
                Enviar Comprovante
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};

export default createPaymentColumns;
