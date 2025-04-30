import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ShoppingBag, CreditCard, Headphones, Truck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sale, PaymentMethod } from "@/types";

// Interface para os dados de venda do banco de dados
interface DbSale {
  id: string;
  code: string;
  date: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
  payment_method: string;
  client_id: string;
  partner_id?: string;
  machine_id?: string;
  created_at: string;
  updated_at: string;
  processing_status: string;
}

// Interface para máquina
interface Machine {
  id: string;
  model: string;
  serial_number: string;
  status: string;
}

// Função para mapear dados do banco para o tipo Sale da aplicação
const mapDbSaleToAppSale = (dbSale: DbSale): Sale => {
  // Mapear método de pagamento string para enum
  let paymentMethod: PaymentMethod;
  switch (dbSale.payment_method) {
    case "CREDIT":
      paymentMethod = PaymentMethod.CREDIT;
      break;
    case "DEBIT":
      paymentMethod = PaymentMethod.DEBIT;
      break;
    case "PIX":
      paymentMethod = PaymentMethod.PIX;
      break;
    default:
      paymentMethod = PaymentMethod.CREDIT;
  }
  
  return {
    id: dbSale.id,
    code: dbSale.code,
    date: new Date(dbSale.date),
    terminal: dbSale.terminal,
    grossAmount: dbSale.gross_amount,
    netAmount: dbSale.net_amount,
    paymentMethod: paymentMethod,
    clientId: dbSale.client_id
  };
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClientId();
    }
  }, [user]);

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  const fetchClientId = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error("Error fetching client data:", error);
        return;
      }

      if (data) {
        setClientId(data.id);
      }
    } catch (error) {
      console.error("Error fetching client ID:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchSalesData(),
        fetchMachinesData()
      ]);
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesData = async () => {
    if (!clientId) return;
    
    // Fetch sales data
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .limit(10);

    if (salesError) {
      console.error("Error fetching sales:", salesError);
    } else {
      // Map database sales to app Sale type
      const mappedSales = salesData ? salesData.map(mapDbSaleToAppSale) : [];
      setSales(mappedSales);
      
      // Calculate balance
      const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.net_amount), 0) || 0;
      setCurrentBalance(totalSales);
    }
  };

  const fetchMachinesData = async () => {
    if (!clientId) return;
    
    // Fetch machines data
    const { data: machinesData, error: machinesError } = await supabase
      .from('machines')
      .select('*')
      .eq('client_id', clientId);

    if (machinesError) {
      console.error("Error fetching machines:", machinesError);
    } else {
      setMachines(machinesData || []);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "Seus dados foram atualizados com sucesso."
    });
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 sm:mt-0"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Atualizando..." : "Atualizar dados"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {currentBalance.toFixed(2)}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => window.location.href = "/payments"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Solicitar Pagamento
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minhas Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
          <Card>
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

        <Tabs defaultValue="sales">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="sales" className="flex-1 sm:flex-none">Minhas Vendas</TabsTrigger>
            <TabsTrigger value="machines" className="flex-1 sm:flex-none">Minhas Máquinas</TabsTrigger>
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
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : sales.length > 0 ? (
                  <div className="overflow-x-auto responsive-table">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Data</th>
                          <th className="py-2 px-4 text-left">Código</th>
                          <th className="py-2 px-4 text-left hidden sm:table-cell">Terminal</th>
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
                            <td className="py-2 px-4 hidden sm:table-cell">{sale.terminal}</td>
                            <td className="py-2 px-4 text-right">
                              R$ {Number(sale.grossAmount).toFixed(2)}
                            </td>
                            <td className="py-2 px-4 text-right">
                              R$ {Number(sale.netAmount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : machines.length > 0 ? (
                  <div className="overflow-x-auto responsive-table">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-4 text-left">Modelo</th>
                          <th className="py-2 px-4 text-left hidden sm:table-cell">Número de Série</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {machines.map((machine) => (
                          <tr key={machine.id} className="border-b">
                            <td className="py-2 px-4">{machine.model}</td>
                            <td className="py-2 px-4 hidden sm:table-cell">{machine.serial_number}</td>
                            <td className="py-2 px-4">
                              <span className={`inline-flex px-2 py-1 rounded text-xs ${machine.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
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
