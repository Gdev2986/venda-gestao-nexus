
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentStatus } from "@/types/enums";
import { formatCurrency } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaymentList } from "@/components/payments/PaymentList";
import { PageHeader } from "@/components/page/PageHeader";
import { usePayments } from "@/hooks/payments/use-payments";
import { useClientBalance } from "@/hooks/use-client-balance";
import { usePixKeys } from "@/hooks/use-pix-keys";
import { PixKeyDisplay } from "@/components/payments/PixKeyDisplay";
import { PixKeyForm } from "@/components/payments/PixKeyForm";
import { requestPixPayment } from "@/lib/api/payments";

const UserPayments = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const { payments, isLoading: isLoadingPayments, error: paymentsError, mutate: refreshPayments } = usePayments();
  const { balance, isLoading: isLoadingBalance, error: balanceError, mutate: refreshBalance } = useClientBalance();
  const { pixKeys, isLoading: isLoadingPixKeys, error: pixKeysError, mutate: refreshPixKeys } = usePixKeys();

  // Filter payments by type
  const deposits = payments?.filter(p => p.type === "deposit") || [];
  const withdrawals = payments?.filter(p => p.type === "withdrawal") || [];

  // Handle payment request submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido para o pagamento.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amount to number
      const amountValue = parseFloat(amount);
      
      if (activeTab === "deposit") {
        // Get the first available pix key id
        const pixKeyId = pixKeys && pixKeys.length > 0 ? pixKeys[0].id : null;
        
        if (!pixKeyId) {
          toast({
            title: "Chave PIX necessária",
            description: "Adicione uma chave PIX antes de solicitar um depósito.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Create a deposit request
        const { data, error } = await supabase
          .from("payment_requests")
          .insert({
            client_id: user?.client_id,
            amount: amountValue,
            description: description || "Depósito via PIX",
            status: "PENDING",
            pix_key_id: pixKeyId
          })
          .select()
          .single();

        if (error) throw error;

        // Call the API to request PIX payment
        const pixResponse = await requestPixPayment({
          paymentId: data.id,
          amount: amountValue,
          description: description || "Depósito via PIX",
          clientId: user?.client_id || ""
        });

        if (pixResponse.error) throw new Error(pixResponse.error);

        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de depósito foi enviada com sucesso."
        });

        // Reset form and refresh data
        setAmount("");
        setDescription("");
        refreshPayments();
      } else {
        // Create a withdrawal request
        if (!description) {
          toast({
            title: "Descrição obrigatória",
            description: "Por favor, informe uma descrição para o saque.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }

        // Check if user has enough balance
        if (balance && amountValue > balance) {
          toast({
            title: "Saldo insuficiente",
            description: "Você não possui saldo suficiente para esta operação.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        
        // Get the first available pix key id
        const pixKeyId = pixKeys && pixKeys.length > 0 ? pixKeys[0].id : null;
        
        if (!pixKeyId) {
          toast({
            title: "Chave PIX necessária",
            description: "Adicione uma chave PIX antes de solicitar um saque.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from("payment_requests")
          .insert({
            client_id: user?.client_id,
            amount: amountValue,
            description: description,
            status: "PENDING",
            pix_key_id: pixKeyId
          });

        if (error) throw error;

        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de saque foi enviada com sucesso."
        });

        // Reset form and refresh data
        setAmount("");
        setDescription("");
        refreshPayments();
      }
    } catch (error: any) {
      console.error("Payment request error:", error);
      toast({
        title: "Erro na solicitação",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    refreshPayments();
    refreshBalance();
    refreshPixKeys();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Pagamentos"
        description="Gerencie seus depósitos e saques"
      />

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Saldo Disponível</CardTitle>
          <CardDescription>Seu saldo atual na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBalance ? (
            <div className="flex items-center justify-center h-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : balanceError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar seu saldo. Tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-3xl font-bold">{formatCurrency(balance || 0)}</div>
          )}
        </CardContent>
      </Card>

      {/* Payment Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Solicitação</CardTitle>
          <CardDescription>Solicite um depósito ou saque</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Depósito</TabsTrigger>
              <TabsTrigger value="withdrawal">Saque</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="space-y-4 pt-4">
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Descrição do depósito"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Solicitar Depósito"
                  )}
                </Button>
              </form>

              {/* PIX Keys Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Suas Chaves PIX</h3>
                {isLoadingPixKeys ? (
                  <div className="flex items-center justify-center h-12">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : pixKeysError ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>
                      Não foi possível carregar suas chaves PIX.
                    </AlertDescription>
                  </Alert>
                ) : pixKeys && pixKeys.length > 0 ? (
                  <div className="space-y-2">
                    {pixKeys.map((key) => (
                      <PixKeyDisplay key={key.id} pixKey={key} onUpdate={refreshPixKeys} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Você ainda não cadastrou nenhuma chave PIX.
                  </p>
                )}

                <div className="mt-4">
                  <PixKeyForm onSuccess={refreshPixKeys} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="withdrawal" className="space-y-4 pt-4">
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-amount">Valor (R$)</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={balance || 0}
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-description">
                    Descrição <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="withdrawal-description"
                    placeholder="Chave PIX ou dados bancários para transferência"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Informe sua chave PIX ou dados bancários completos para receber o valor.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Solicitar Saque"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Acompanhe suas solicitações de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposits">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposits">Depósitos</TabsTrigger>
              <TabsTrigger value="withdrawals">Saques</TabsTrigger>
            </TabsList>
            <TabsContent value="deposits" className="pt-4">
              {isLoadingPayments ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : paymentsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Não foi possível carregar seu histórico de pagamentos.
                  </AlertDescription>
                </Alert>
              ) : deposits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não possui depósitos registrados.
                </div>
              ) : (
                <PaymentList payments={deposits} onUpdate={refreshPayments} />
              )}
            </TabsContent>
            <TabsContent value="withdrawals" className="pt-4">
              {isLoadingPayments ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : paymentsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Não foi possível carregar seu histórico de saques.
                  </AlertDescription>
                </Alert>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Você ainda não possui saques registrados.
                </div>
              ) : (
                <PaymentList payments={withdrawals} onUpdate={refreshPayments} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => refreshPayments()}>
            Atualizar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserPayments;
