
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaymentRequests } from "@/hooks/use-payment-requests";
import { PaymentRequestStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Plus, RefreshCw } from "lucide-react";
import PaymentRequestForm from "@/components/payments/PaymentRequestForm";
import PixKeyForm from "@/components/payments/PixKeyForm";

const ClientPayments = () => {
  const { paymentRequests, pixKeys, currentBalance, isLoading, refreshData } = usePaymentRequests();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPixKeyForm, setShowPixKeyForm] = useState(false);
  
  const getStatusBadge = (status: PaymentRequestStatus) => {
    switch (status) {
      case PaymentRequestStatus.PENDING:
        return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Pendente</span>;
      case PaymentRequestStatus.APPROVED:
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Aprovado</span>;
      case PaymentRequestStatus.PAID:
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Pago</span>;
      case PaymentRequestStatus.REJECTED:
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Rejeitado</span>;
      default:
        return null;
    }
  };
  
  const handleOpenPaymentForm = () => {
    if (pixKeys.length > 0) {
      setShowPaymentForm(true);
    } else {
      setShowPixKeyForm(true);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-muted-foreground">
          Gerencie seus pagamentos e chaves PIX
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Saldo Disponível</CardTitle>
          <CardDescription>
            Este é o valor total disponível para saque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                ) : (
                  formatCurrency(currentBalance)
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Atualizado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleOpenPaymentForm}
                disabled={isLoading || currentBalance <= 0}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Solicitar Pagamento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Minhas Solicitações</TabsTrigger>
          <TabsTrigger value="keys">Chaves PIX</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Solicitações</CardTitle>
              <CardDescription>
                Acompanhe o status das suas solicitações de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : paymentRequests.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Data</th>
                        <th className="py-3 px-4 text-left font-medium">Valor</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Atualização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRequests.map((request) => (
                        <tr key={request.id} className="border-b">
                          <td className="py-3 px-4">
                            {format(new Date(request.created_at!), "dd/MM/yyyy", { locale: ptBR })}
                          </td>
                          <td className="py-3 px-4">
                            {formatCurrency(Number(request.amount))}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {request.approved_at ? 
                              format(new Date(request.approved_at), "dd/MM/yyyy", { locale: ptBR }) :
                              "—"
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não solicitou nenhum pagamento.
                  </p>
                  <Button onClick={handleOpenPaymentForm}>
                    Solicitar Primeiro Pagamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Minhas Chaves PIX</CardTitle>
                <CardDescription>
                  Gerencie suas chaves PIX para recebimento de pagamentos
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={() => setShowPixKeyForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Chave
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : pixKeys.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Nome</th>
                        <th className="py-3 px-4 text-left font-medium">Tipo</th>
                        <th className="py-3 px-4 text-left font-medium">Chave</th>
                        <th className="py-3 px-4 text-center font-medium">Padrão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pixKeys.map((pixKey) => (
                        <tr key={pixKey.id} className="border-b">
                          <td className="py-3 px-4">{pixKey.name}</td>
                          <td className="py-3 px-4">{pixKey.type}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono">{pixKey.key}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {pixKey.is_default ? "✓" : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não cadastrou nenhuma chave PIX.
                  </p>
                  <Button onClick={() => setShowPixKeyForm(true)}>
                    Cadastrar Primeira Chave
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PaymentRequestForm
        open={showPaymentForm}
        onOpenChange={setShowPaymentForm}
        onAddPixKey={() => {
          setShowPaymentForm(false);
          setShowPixKeyForm(true);
        }}
      />
      
      <PixKeyForm
        open={showPixKeyForm}
        onOpenChange={setShowPixKeyForm}
      />
    </MainLayout>
  );
};

export default ClientPayments;
