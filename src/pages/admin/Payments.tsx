
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Upload, MessageSquare, Edit } from "lucide-react";
import { PageHeader } from "@/components/page/PageHeader";
import { usePaymentsFetcher } from "@/hooks/payments/usePaymentsFetcher";
import { PaymentRequest, PaymentStatus } from "@/types/payment.types";
import { formatCurrency } from "@/utils/currency";

const AdminPayments = () => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const { payments: fetchedPayments, loading, error, refetch } = usePaymentsFetcher();

  useEffect(() => {
    setPayments(fetchedPayments);
  }, [fetchedPayments]);

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

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "Pendente";
      case PaymentStatus.APPROVED:
        return "Aprovado";
      case PaymentStatus.REJECTED:
        return "Rejeitado";
      case PaymentStatus.PAID:
        return "Pago";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gerenciar Pagamentos"
          description="Visualize e gerencie todas as solicitações de pagamento"
        />
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gerenciar Pagamentos"
          description="Visualize e gerencie todas as solicitações de pagamento"
        />
        <div className="text-center text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Pagamentos"
        description="Visualize e gerencie todas as solicitações de pagamento"
      />

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">
                    {payment.client?.business_name || "Cliente não encontrado"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Solicitação #{payment.id.slice(0, 8)}
                  </p>
                </div>
                <Badge className={getStatusColor(payment.status)}>
                  {getStatusText(payment.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">PIX</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                    <p className="font-medium">
                      {new Date(payment.requested_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">{payment.description || "Sem descrição"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Boleto
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Comprovante
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Adicionar Nota
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Alterar Status
                  </Button>
                </div>

                {payment.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Motivo da rejeição:</strong> {payment.rejection_reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
