
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Check, X } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatters";
import { PaymentData } from "@/hooks/payments/payment.types";

// Define the available payment actions
export type PaymentAction = "approve" | "reject" | "details";

interface PaymentColumnsOptions {
  onPaymentAction: (payment: PaymentData, action: PaymentAction) => void;
}

// Function to create payment columns with actions
export const createPaymentColumns = ({ onPaymentAction }: PaymentColumnsOptions): ColumnDef<PaymentData>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <span className="font-mono text-xs">{id.substring(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "client_name",
    header: "Cliente",
    cell: ({ row }) => <div className="font-medium">{row.getValue("client_name")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-[200px] truncate">{description || "Sem descrição"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{format(date, "dd/MM/yyyy HH:mm")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      const getBadgeVariant = () => {
        switch (status) {
          case "PENDING":
            return "outline";
          case "APPROVED":
            return "success";
          case "REJECTED":
            return "destructive";
          default:
            return "secondary";
        }
      };

      const getStatusLabel = () => {
        switch (status) {
          case "PENDING":
            return "Pendente";
          case "APPROVED":
            return "Aprovado";
          case "REJECTED":
            return "Rejeitado";
          default:
            return status;
        }
      };

      return (
        <Badge variant={getBadgeVariant()} className="capitalize">
          {getStatusLabel()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onPaymentAction(payment, "details")}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Detalhes
            </DropdownMenuItem>
            
            {payment.status === "PENDING" && (
              <>
                <DropdownMenuItem 
                  onClick={() => onPaymentAction(payment, "approve")}
                  className="flex items-center gap-2 text-green-600"
                >
                  <Check className="w-4 h-4" /> Aprovar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onPaymentAction(payment, "reject")}
                  className="flex items-center gap-2 text-red-600"
                >
                  <X className="w-4 h-4" /> Rejeitar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
