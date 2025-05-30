
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { NormalizedSale } from "@/utils/sales-processor";

// Helper function to format date consistently
const formatTransactionDate = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return 'N/A';
  
  if (typeof dateValue === 'string') {
    return dateValue;
  }
  
  if (dateValue instanceof Date) {
    return dateValue.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return String(dateValue);
};

// Payment method badge function with dark theme support
const getPaymentMethodBadge = (method: string, installments?: number) => {
  switch (method) {
    case 'CREDIT':
    case 'Cartão de Crédito':
      const installmentText = installments && installments > 1 ? ` ${installments}x` : " À Vista";
      return (
        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
          Crédito{installmentText}
        </Badge>
      );
    case 'DEBIT':
    case 'Cartão de Débito':
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white border-green-600">
          Débito
        </Badge>
      );
    case 'PIX':
    case 'Pix':
      return (
        <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600">
          PIX
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-gray-500 text-gray-700 dark:text-gray-300">
          {method}
        </Badge>
      );
  }
};

export const salesTableColumns: ColumnDef<NormalizedSale>[] = [
  {
    id: "payment_type",
    header: "Tipo de Pagamento",
    cell: ({ row }) => (
      <div className="text-center">
        {getPaymentMethodBadge(row.original.payment_type, row.original.installments)}
      </div>
    )
  },
  {
    id: "gross_amount",
    header: "Valor Bruto",
    cell: ({ row }) => (
      <span className="font-medium text-right">
        {row.original.formatted_amount}
      </span>
    )
  },
  {
    id: "transaction_date",
    header: "Data/Hora",
    cell: ({ row }) => {
      const formattedDate = formatTransactionDate(row.original.transaction_date);
      return (
        <span className="font-medium text-sm">
          {formattedDate}
        </span>
      );
    }
  },
  {
    id: "terminal",
    header: "Terminal", 
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.terminal}
      </span>
    )
  }
];
