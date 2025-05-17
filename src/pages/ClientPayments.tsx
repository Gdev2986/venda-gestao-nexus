import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/enums";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";

const ClientPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedPaymentId, setCopiedPaymentId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen: dialogOpen,
    setIsDialogOpen: setDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys,
    loadPaymentRequests
  } = usePaymentRequests();

  useEffect(() => {
    if (user) {
      loadPaymentRequests();
    }
  }, [user, loadPaymentRequests]);

  const handleCopyPaymentId = (paymentId: string) => {
    navigator.clipboard.writeText(paymentId);
    setCopiedPaymentId(paymentId);
    toast({
      title: "ID copiado",
      description: "O ID do pagamento foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedPaymentId(null), 2000);
  };

  const handleRefreshPayments = async () => {
    setIsRefreshing(true);
    try {
      await loadPaymentRequests();
      toast({
        title: "Pagamentos atualizados",
        description: "A lista de pagamentos foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a lista de pagamentos.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const openPaymentRequestDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Seus Pagamentos"
        description="Acompanhe o histórico e solicite novos pagamentos"
      />

      <Card className="p-4 md:p-6">
        <CardHeader>
          <CardTitle>Saldo Disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              R$ {clientBalance?.toFixed(2) || "0,00"}
            </div>
            <Button onClick={openPaymentRequestDialog}>Solicitar Pagamento</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 md:p-6">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <Button
            variant="ghost"
            onClick={handleRefreshPayments}
            disabled={isLoading || isRefreshing}
          >
            {isLoading || isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4">Carregando pagamentos...</div>
          ) : paymentRequests.length === 0 ? (
            <div className="text-center py-4">Nenhum pagamento encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[150px]">ID do Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === PaymentStatus.APPROVED
                            ? "success"
                            : payment.status === PaymentStatus.REJECTED
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="truncate">{payment.id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPaymentId(payment.id)}
                          disabled={copiedPaymentId === payment.id}
                        >
                          {copiedPaymentId === payment.id ? (
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copiar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaymentRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={clientBalance}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default ClientPayments;
