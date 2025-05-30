
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { NormalizedSale } from "@/utils/sales-processor";
import { PaymentTypeBadge } from "@/components/sales/PaymentTypeBadge";

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

export const salesTableColumns: ColumnDef<NormalizedSale>[] = [
  {
    id: "payment_type",
    header: "Tipo de Pagamento",
    cell: ({ row }) => (
      <div className="text-center">
        <PaymentTypeBadge 
          paymentType={row.original.payment_type} 
          installments={row.original.installments} 
        />
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
