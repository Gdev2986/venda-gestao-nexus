
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentData } from "@/hooks/usePayments";
import { PaymentStatus } from "@/types";

export type PaymentAction = "approve" | "reject" | "details";

interface PaymentTableColumnsProps {
  onPaymentAction: (payment: PaymentData, action: PaymentAction) => void;
}

export const createPaymentColumns = ({ onPaymentAction }: PaymentTableColumnsProps) => [
  {
    id: "client",
    header: "Cliente",
    accessorFn: (row: PaymentData) => row.client?.business_name || "N/A",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "type",
    header: "Tipo",
    accessorFn: (row: PaymentData) => row.pix_key?.type || "PIX",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "key",
    header: "Chave PIX",
    accessorFn: (row: PaymentData) => row.pix_key?.key || "N/A",
    cell: (info: any) => {
      const key = info.getValue();
      // Truncate long keys for display
      return key.length > 20 ? `${key.substring(0, 17)}...` : key;
    }
  },
  {
    id: "amount",
    header: "Valor",
    accessorKey: "amount",
    cell: (info: any) => formatCurrency(info.getValue()),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (info: any) => <PaymentStatusBadge status={info.getValue()} />,
  },
  {
    id: "created_at",
    header: "Data",
    accessorKey: "created_at",
    cell: (info: any) => {
      try {
        return format(new Date(info.getValue()), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
      } catch (error) {
        return "Data inválida";
      }
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (info: any) => {
      const payment = info.row.original;
      const isPending = payment.status === PaymentStatus.PENDING;
      
      return (
        <div className="flex items-center space-x-2">
          {isPending && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onPaymentAction(payment, 'approve')}
                className="flex items-center text-green-600 hover:text-green-800 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onPaymentAction(payment, 'reject')}
                className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onPaymentAction(payment, 'details')}
            className="flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detalhes
          </Button>
        </div>
      );
    },
  },
];
