
import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ShoppingBag, CreditCard, Headphones, Truck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sale, SaleDb, PaymentMethod } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClientId();
    }
  }, [user]);

  // Separate function to fetch client ID
  const fetchClientId = async () => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        return;
      }

      if (clientData) {
        setClientId(clientData.id);
        fetchClientData(clientData.id);
      }
    } catch (error) {
      console.error("Error fetching client ID:", error);
    }
  };

  const fetchClientData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Fetch sales data
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('client_id', id)
        .order('date', { ascending: false })
        .limit(10);

      if (salesError) {
        console.error("Error fetching sales:", salesError);
      } else if (salesData) {
        // Convert database sales to application Sales type
        const formattedSales: Sale[] = salesData.map((sale: SaleDb) => ({
          id: sale.id,
          code: sale.code,
          date: new Date(sale.date),
          terminal: sale.terminal,
          grossAmount: sale.gross_amount,
          netAmount: sale.net_amount,
          paymentMethod: sale.payment_method as PaymentMethod, // Cast to enum type
          clientId: sale.client_id
        }));
        
        setSales(formattedSales);
      }

      // Fetch machines data
      const { data: machinesData, error: machinesError } = await supabase
        .from('machines')
        .select('*')
        .eq('client_id', id);

      if (machinesError) {
        console.error("Error fetching machines:", machinesError);
      } else {
        setMachines(machinesData || []);
      }

      // Fetch client balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('vw_client_balance')
        .select('balance')
        .eq('client_id', id)
        .maybeSingle();

      if (balanceError) {
        console.error("Error fetching balance:", balanceError);
      } else if (balanceData) {
        setCurrentBalance(Number(balanceData.balance) || 0);
      } else {
        // Fallback calculation if view doesn't return data
        const totalSales = salesData?.reduce((sum: number, sale: SaleDb) => sum + Number(sale.net_amount), 0) || 0;
        setCurrentBalance(totalSales);
      }
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refreshData = () => {
    if (clientId) {
      setIsRefreshing(true);
      fetchClientData(clientId);
    }
  };

  const handleSupportRequest = () => {
    toast({
      title: "Solicitação de suporte",
      description: "Sua solicitação foi recebida. Um de nossos atendentes entrará em contato em breve."
    });
  };

  const handleSupplyRequest = () => {
    toast({
      title: "Solicitação de bobinas",
      description: "Sua solicitação de bobinas foi registrada. Vamos processá-la em breve."
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={isRefreshing}
            className="self-end sm:self-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(currentBalance)}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => window.location.href = "/payments"}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Solicitar Pagamento
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minhas Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {machines.length}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => window.location.href = "/machines"}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ver Máquinas
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSupportRequest}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Solicitar Assistência
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSupplyRequest}
              >
                <Truck className="mr-2 h-4 w-4" />
                Solicitar Bobinas
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="sales">Minhas Vendas</TabsTrigger>
            <TabsTrigger value="machines">Minhas Máquinas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
                <CardDescription>
                  Suas transações mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : sales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="rounded-md border min-w-full inline-block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-4 text-left">Data</th>
                            <th className="py-2 px-4 text-left">Código</th>
                            <th className="py-2 px-4 text-left">Terminal</th>
                            <th className="py-2 px-4 text-right">Valor Bruto</th>
                            <th className="py-2 px-4 text-right">Valor Líquido</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales.map((sale) => (
                            <tr key={sale.id} className="border-b">
                              <td className="py-2 px-4">
                                {new Date(sale.date).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-4">{sale.code}</td>
                              <td className="py-2 px-4">{sale.terminal}</td>
                              <td className="py-2 px-4 text-right">
                                {formatCurrency(sale.grossAmount)}
                              </td>
                              <td className="py-2 px-4 text-right">
                                {formatCurrency(sale.netAmount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma venda encontrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machines" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Máquinas</CardTitle>
                <CardDescription>
                  Máquinas vinculadas à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : machines.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="rounded-md border min-w-full inline-block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-4 text-left">Modelo</th>
                            <th className="py-2 px-4 text-left">Número de Série</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machines.map((machine) => (
                            <tr key={machine.id} className="border-b">
                              <td className="py-2 px-4">{machine.model}</td>
                              <td className="py-2 px-4">{machine.serial_number}</td>
                              <td className="py-2 px-4">
                                <span className={`px-2 py-1 rounded text-xs ${machine.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {machine.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleSupportRequest}
                                >
                                  Suporte
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma máquina encontrada.</p>
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

export default ClientDashboard;
