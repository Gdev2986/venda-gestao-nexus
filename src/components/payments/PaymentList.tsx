
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MoreVertical, Eye, FileCheck, AlertOctagon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { PaymentStatus, PaymentAction } from "@/types/enums";
import { Payment } from "@/types/payment.types";
import { usePaymentActions } from "@/hooks/payments/usePaymentActions";
import { useToast } from "@/hooks/use-toast";

interface PaymentListProps {
  payments: Payment[];
  onUpdate?: () => void;
}

export function PaymentList({ payments, onUpdate }: PaymentListProps) {
  const { toast } = useToast();
  const { approvePayment, rejectPayment, deletePayment, sendReceipt, isLoading } = usePaymentActions();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  
  const handleAction = async (paymentId: string, action: PaymentAction) => {
    setSelectedPaymentId(paymentId);
    try {
      let success = false;
      
      switch (action) {
        case PaymentAction.VIEW:
          // Implement view logic if needed
          break;
        case PaymentAction.APPROVE:
          success = await approvePayment(paymentId);
          if (success) {
            toast({
              title: "Pagamento aprovado",
              description: "O pagamento foi aprovado com sucesso"
            });
          }
          break;
        case PaymentAction.REJECT:
          success = await rejectPayment(paymentId);
          if (success) {
            toast({
              title: "Pagamento rejeitado",
              description: "O pagamento foi rejeitado com sucesso"
            });
          }
          break;
        case PaymentAction.DELETE:
          success = await deletePayment(paymentId);
          if (success) {
            toast({
              title: "Pagamento excluído",
              description: "O pagamento foi excluído com sucesso"
            });
          }
          break;
        case PaymentAction.SEND_RECEIPT:
          success = await sendReceipt(paymentId);
          if (success) {
            toast({
              title: "Comprovante enviado",
              description: "O comprovante foi enviado com sucesso"
            });
          }
          break;
      }
      
      if (success && onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar a ação"
      });
    } finally {
      setSelectedPaymentId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge variant="outline">Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge variant="success">Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive">Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge variant="default">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum pagamento encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium">Valor</h3>
              <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
              <p className="text-xs text-muted-foreground">
                {payment.description || "Sem descrição"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Data</h3>
              <p className="text-sm">{formatDate(payment.created_at)}</p>
              <div className="mt-1">
                {getStatusBadge(payment.status)}
              </div>
            </div>
            
            <div className="flex justify-end items-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {selectedPaymentId === payment.id && isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleAction(payment.id, PaymentAction.VIEW)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  
                  {payment.status === PaymentStatus.APPROVED && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleAction(payment.id, PaymentAction.SEND_RECEIPT)}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        Enviar comprovante
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleAction(payment.id, PaymentAction.DELETE)}
                    className="text-red-600"
                  >
                    <AlertOctagon className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
