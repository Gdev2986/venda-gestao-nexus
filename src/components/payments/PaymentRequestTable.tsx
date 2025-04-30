
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Payment, PaymentStatus, PaymentType } from "@/types";

interface PaymentRequestTableProps {
  payments: Payment[];
  isLoading: boolean;
}

export const PaymentRequestTable = ({ payments, isLoading }: PaymentRequestTableProps) => {
  const { toast } = useToast();

  // Define table columns with proper type checking and null handling
  const columns = [
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => {
        // Add null check before accessing row.original
        if (!info || !info.row || !info.row.original) {
          return "N/A";
        }
        return new Date(info.row.original.created_at).toLocaleDateString('pt-BR');
      }
    },
    {
      id: "payment_type",
      header: "Tipo",
      accessorKey: "payment_type",
      cell: (info: any) => {
        // Add null check before accessing row.original
        if (!info || !info.row || !info.row.original) {
          return "N/A";
        }
        const type = info.row.original.payment_type;
        if (type === PaymentType.PIX) return "PIX";
        if (type === PaymentType.TED) return "TED";
        if (type === PaymentType.BOLETO) return "Boleto";
        return "Outros";
      }
    },
    {
      id: "description",
      header: "Descrição",
      accessorKey: "description"
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => {
        // Add null check before accessing row.original
        if (!info || !info.row || !info.row.original) {
          return "N/A";
        }
        return formatCurrency(info.row.original.amount);
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        // Add null check before accessing row.original
        if (!info || !info.row || !info.row.original) {
          return "N/A";
        }
        
        const status = info.row.original.status;
        let badgeClass = "";
        let statusText = "";
        
        switch (status) {
          case PaymentStatus.PENDING:
            badgeClass = "bg-yellow-100 text-yellow-800";
            statusText = "Pendente";
            break;
          case PaymentStatus.APPROVED:
            badgeClass = "bg-blue-100 text-blue-800";
            statusText = "Aprovado";
            break;
          case PaymentStatus.PAID:
            badgeClass = "bg-green-100 text-green-800";
            statusText = "Pago";
            break;
          case PaymentStatus.REJECTED:
            badgeClass = "bg-red-100 text-red-800";
            statusText = "Rejeitado";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            statusText = "Desconhecido";
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {statusText}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: (info: any) => {
        // Add null check before accessing row.original
        if (!info || !info.row || !info.row.original) {
          return null;
        }
        
        const { receipt_url, status, document_url, payment_type, bank_info } = info.row.original;
        
        const renderButtons = () => {
          const buttons = [];
          
          // Receipt button for approved/paid payments
          if (receipt_url && (status === PaymentStatus.PAID || status === PaymentStatus.APPROVED)) {
            buttons.push(
              <Button key="receipt" size="sm" variant="ghost" asChild>
                <a href={receipt_url} target="_blank" rel="noopener noreferrer">
                  Recibo
                </a>
              </Button>
            );
          }
          
          // Document button for boleto payments
          if (document_url && payment_type === PaymentType.BOLETO) {
            buttons.push(
              <Button key="document" size="sm" variant="ghost" asChild>
                <a href={document_url} target="_blank" rel="noopener noreferrer">
                  Boleto
                </a>
              </Button>
            );
          }
          
          // Bank info button for TED payments
          if (bank_info && payment_type === PaymentType.TED) {
            buttons.push(
              <Button
                key="bankInfo"
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast({
                    title: "Informações Bancárias",
                    description: `Banco: ${bank_info.bank_name}, Agência: ${bank_info.branch_number}, Conta: ${bank_info.account_number}`,
                  });
                }}
              >
                Detalhes
              </Button>
            );
          }
          
          return buttons.length > 0 ? buttons : null;
        };
        
        return renderButtons();
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada</p>
      </div>
    );
  }

  return <DataTable columns={columns} data={payments} />;
};
