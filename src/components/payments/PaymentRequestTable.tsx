
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Payment, PaymentStatus, PaymentType } from "@/types/enums";
import { Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PaymentRequestTableProps {
  payments: any[];
  isLoading: boolean;
}

export const PaymentRequestTable = ({ payments, isLoading }: PaymentRequestTableProps) => {
  const { toast } = useToast();

  // Função para formatar a data
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Função para traduzir o tipo de pagamento
  const getPaymentTypeLabel = (type: string | null | undefined): string => {
    if (!type) return "Não especificado";
    
    switch (type) {
      case PaymentType.PIX:
        return "PIX";
      case PaymentType.TED:
        return "TED";
      case PaymentType.BOLETO:
        return "Boleto";
      default:
        return type;
    }
  };

  // Função para traduzir o status
  const getStatusLabel = (status: string | null | undefined): string => {
    if (!status) return "Desconhecido";
    
    switch (status) {
      case PaymentStatus.PENDING:
        return "Pendente";
      case PaymentStatus.PROCESSING:
        return "Em Processamento";
      case PaymentStatus.APPROVED:
        return "Aprovado";
      case PaymentStatus.REJECTED:
        return "Recusado";
      case PaymentStatus.PAID:
        return "Pago";
      default:
        return status;
    }
  };

  // Função para determinar a cor baseada no status
  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "";
    
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

  // Define table columns
  const columns = [
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => {
        if (!info?.row?.original) return "N/A";
        return formatDate(info.row.original.created_at);
      }
    },
    {
      id: "payment_type",
      header: "Tipo",
      accessorKey: "payment_type",
      cell: (info: any) => {
        if (!info?.row?.original) return "N/A";
        return getPaymentTypeLabel(info.row.original.payment_type);
      }
    },
    {
      id: "description",
      header: "Descrição",
      accessorKey: "description",
      cell: (info: any) => {
        if (!info?.row?.original) return "N/A";
        return info.row.original.description || "Sem descrição";
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => {
        if (!info?.row?.original) return "N/A";
        return formatCurrency(info.row.original.amount);
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        if (!info?.row?.original) return "N/A";
        
        const status = info.row.original.status;
        return (
          <Badge className={getStatusColor(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: (info: any) => {
        if (!info?.row?.original) return null;
        
        const { receipt_url, status, document_url, payment_type, bank_info } = info.row.original;
        
        const renderButtons = () => {
          const buttons = [];
          
          // Botão de recibo para pagamentos aprovados/pagos
          if (receipt_url && [PaymentStatus.PAID, PaymentStatus.APPROVED].includes(status)) {
            buttons.push(
              <Button key="receipt" size="sm" variant="outline" className="h-8 px-2" asChild>
                <a href={receipt_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3 w-3 mr-1" />
                  Recibo
                </a>
              </Button>
            );
          }
          
          // Botão de documento para pagamentos boleto
          if (document_url && payment_type === PaymentType.BOLETO) {
            buttons.push(
              <Button key="document" size="sm" variant="outline" className="h-8 px-2" asChild>
                <a href={document_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Boleto
                </a>
              </Button>
            );
          }
          
          // Botão de info bancária para pagamentos TED
          if (bank_info && payment_type === PaymentType.TED) {
            buttons.push(
              <Button
                key="bankInfo"
                size="sm"
                variant="outline"
                className="h-8 px-2"
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
          
          // Mensagem de rejeição se aplicável
          if (status === PaymentStatus.REJECTED && info.row.original.rejection_reason) {
            buttons.push(
              <Button
                key="rejectionReason"
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-destructive"
                onClick={() => {
                  toast({
                    title: "Motivo da Recusa",
                    description: info.row.original.rejection_reason,
                    variant: "destructive"
                  });
                }}
              >
                Motivo da recusa
              </Button>
            );
          }
          
          return buttons.length > 0 ? (
            <div className="flex flex-wrap gap-2">{buttons}</div>
          ) : null;
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

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-auto">
      <DataTable columns={columns} data={payments} />
    </div>
  );
};
