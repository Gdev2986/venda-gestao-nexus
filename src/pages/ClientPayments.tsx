
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

const paymentSchema = z.object({
  amount: z.string()
    .refine((val) => !isNaN(Number(val)), { message: "O valor precisa ser um número" })
    .refine((val) => Number(val) > 0, { message: "O valor precisa ser maior que zero" }),
  pixKey: z.string().uuid({ message: "Chave PIX inválida" }),
});

const ClientPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [pixKeys, setPixKeys] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      pixKey: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        return;
      }

      if (clientData) {
        setClientId(clientData.id);

        // Fetch balance (mock calculation)
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('net_amount')
          .eq('client_id', clientData.id);

        if (salesError) {
          console.error("Error fetching sales:", salesError);
        } else {
          const totalSales = salesData?.reduce((sum: number, sale: any) => sum + Number(sale.net_amount), 0) || 0;
          setBalance(totalSales);
        }

        // Fetch PIX keys
        const { data: pixKeysData, error: pixKeysError } = await supabase
          .from('pix_keys')
          .select('*')
          .eq('user_id', user?.id);

        if (pixKeysError) {
          console.error("Error fetching PIX keys:", pixKeysError);
        } else {
          setPixKeys(pixKeysData || []);
          // Set default PIX key if available
          const defaultKey = pixKeysData?.find(key => key.is_default);
          if (defaultKey) {
            form.setValue('pixKey', defaultKey.id);
          } else if (pixKeysData && pixKeysData.length > 0) {
            form.setValue('pixKey', pixKeysData[0].id);
          }
        }

        // Fetch payment requests
        const { data: paymentData, error: paymentError } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });

        if (paymentError) {
          console.error("Error fetching payment requests:", paymentError);
        } else {
          setPayments(paymentData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID do cliente não encontrado"
      });
      return;
    }

    try {
      const amount = Number(values.amount);
      
      // Check if amount is valid
      if (isNaN(amount) || amount <= 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "O valor solicitado deve ser maior que zero"
        });
        return;
      }

      // Check if amount is available
      if (amount > balance) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Saldo insuficiente para esta solicitação"
        });
        return;
      }

      const { error } = await supabase
        .from('payment_requests')
        .insert([
          {
            client_id: clientId,
            amount: amount,
            pix_key_id: values.pixKey,
            status: 'PENDING'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso."
      });

      // Reset form and refresh data
      form.reset();
      fetchData();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na solicitação",
        description: error.message || "Não foi possível enviar sua solicitação"
      });
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="flex items-center text-yellow-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pendente</span>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Aprovado</span>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Rejeitado</span>
          </div>
        );
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus pagamentos e solicite saques
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saldo Disponível</CardTitle>
              <CardDescription>
                Valor total disponível para saque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                R$ {balance.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Você pode solicitar o saque deste valor para sua conta cadastrada
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Pagamento</CardTitle>
              <CardDescription>
                Preencha os dados para solicitar seu pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">R$</span>
                            <Input
                              placeholder="0,00"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Informe o valor que deseja receber
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {pixKeys.length > 0 ? (
                    <FormField
                      control={form.control}
                      name="pixKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave PIX</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {pixKeys.map((key) => (
                                <option key={key.id} value={key.id}>
                                  {key.name} ({key.key})
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormDescription>
                            Selecione a chave PIX para receber o pagamento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="rounded-md bg-yellow-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Nenhuma chave PIX encontrada
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Você precisa cadastrar uma chave PIX antes de solicitar pagamentos.
                            </p>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = "/settings"}
                            >
                              Cadastrar Chave PIX
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || pixKeys.length === 0}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Solicitar Pagamento
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="history" className="w-full">
          <TabsList>
            <TabsTrigger value="history">Histórico de Pagamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Pagamento</CardTitle>
                <CardDescription>
                  Histórico de todas as suas solicitações
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : payments.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Data</th>
                          <th className="py-2 px-4 text-right">Valor</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Data Aprovação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-2 px-4">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 text-right">
                              R$ {Number(payment.amount).toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              {formatStatus(payment.status)}
                            </td>
                            <td className="py-2 px-4">
                              {payment.approved_at 
                                ? new Date(payment.approved_at).toLocaleDateString() 
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma solicitação de pagamento encontrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientPayments;
