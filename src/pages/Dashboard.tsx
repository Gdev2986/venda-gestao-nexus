import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import { DashboardStats, PaymentMethod, Sale, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import ClientActions from "@/components/dashboard/ClientActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// Mock data for development purposes
const generateMockData = (): DashboardStats => {
  const currentBalance = Math.random() * 10000;
  const yesterdayGross = Math.random() * 1500;
  const yesterdayNet = yesterdayGross * 0.97; // 3% fee
  const totalSales = Math.floor(Math.random() * 100) + 50;

  const salesByMethod = [
    {
      method: PaymentMethod.CREDIT,
      amount: Math.random() * 5000,
      percentage: 0,
    },
    {
      method: PaymentMethod.DEBIT,
      amount: Math.random() * 3000,
      percentage: 0,
    },
    {
      method: PaymentMethod.PIX,
      amount: Math.random() * 2000,
      percentage: 0,
    },
  ];

  // Calculate percentages
  const total = salesByMethod.reduce((sum, item) => sum + item.amount, 0);
  salesByMethod.forEach(item => {
    item.percentage = parseFloat(((item.amount / total) * 100).toFixed(1));
  });

  // Generate recent sales
  const recentSales: Sale[] = [];
  for (let i = 0; i < 10; i++) {
    const grossAmount = Math.random() * 500;
    const netAmount = grossAmount * 0.97; // 3% fee
    const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const terminals = ["T123456", "T789012", "T345678", "T901234"];
    
    recentSales.push({
      id: `sale_${i}`,
      code: `VND${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      grossAmount,
      netAmount,
      paymentMethod: method,
      payment_method: method,
      client_id: "client_1",
      created_at: new Date().toISOString(),
      amount: grossAmount,
      status: "completed"
    });
  }

  return {
    currentBalance,
    yesterdayGrossAmount: yesterdayGross,
    yesterdayNetAmount: yesterdayNet,
    totalSales,
    salesByPaymentMethod: salesByMethod,
    recentSales,
    totalClients: 50,
    totalRevenue: 25000,
    pendingPayments: 5
  };
};

// Admin specific components
const AdminActionCards = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Ação iniciada",
      description: `Você iniciou a ação: ${action}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-3">
            <ArrowUpIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Aprovar Pagamentos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Revise e aprove os pagamentos pendentes dos clientes
          </p>
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => handleAction("Aprovar Pagamentos")}
          >
            Ver Pagamentos Pendentes
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-3">
            <TrendingUpIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Relatórios Financeiros</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Gere relatórios detalhados sobre as transações e lucros
          </p>
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => handleAction("Gerar Relatórios")}
          >
            Gerar Relatórios
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-3">
            <TrendingDownIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Configurar Taxas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ajuste as taxas de processamento para cada tipo de pagamento
          </p>
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => handleAction("Configurar Taxas")}
          >
            Configurar Taxas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminMetrics = () => {
  // Sample data for the metrics
  const metrics = {
    clientsActive: 86,
    clientsInactive: 12,
    clientsBlocked: 3,
    paymentsCompleted: 457,
    paymentsPending: 23,
    paymentsRejected: 9,
    revenue: 45820.53,
    revenueLast: 38250.22,
    revenueGrowth: 19.8,
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clients">
          <TabsList className="mb-4 w-full lg:w-auto">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.clientsActive}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.clientsActive / (metrics.clientsActive + metrics.clientsInactive + metrics.clientsBlocked)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Inativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.clientsInactive}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.clientsInactive / (metrics.clientsActive + metrics.clientsInactive + metrics.clientsBlocked)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Bloqueados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.clientsBlocked}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.clientsBlocked / (metrics.clientsActive + metrics.clientsInactive + metrics.clientsBlocked)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pagamentos Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.paymentsCompleted}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.paymentsCompleted / (metrics.paymentsCompleted + metrics.paymentsPending + metrics.paymentsRejected)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.paymentsPending}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.paymentsPending / (metrics.paymentsCompleted + metrics.paymentsPending + metrics.paymentsRejected)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pagamentos Rejeitados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.paymentsRejected}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.paymentsRejected / (metrics.paymentsCompleted + metrics.paymentsPending + metrics.paymentsRejected)) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Receita do Mês (R$)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR').format(metrics.revenue)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs flex items-center gap-1 text-success">
                      <ArrowUpIcon className="h-3 w-3" />
                      {metrics.revenueGrowth}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs mês anterior
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mês Anterior (R$)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR').format(metrics.revenueLast)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receita total do mês passado
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const { toast } = useToast();
  const { userRole } = useUserRole();

  const loadData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  const handleDateRangeChange = (range: { from: Date, to: Date }) => {
    toast({
      title: "Filtro de data atualizado",
      description: `Período selecionado: ${range.from.toLocaleDateString('pt-BR')} a ${range.to.toLocaleDateString('pt-BR')}`,
    });
    
    // In a real app, we would fetch new data based on the date range
    loadData();
  };

  return (
    <div className="flex-1">
      <DashboardHeader onDateRangeChange={handleDateRangeChange} />
      
      {data && (
        <>
          <StatsCards
            currentBalance={data.currentBalance}
            yesterdayGross={data.yesterdayGrossAmount}
            yesterdayNet={data.yesterdayNetAmount}
            totalSales={data.totalSales}
            isLoading={isLoading}
          />
          
          {userRole === UserRole.ADMIN && (
            <AdminMetrics />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SalesChart
              data={data.salesByPaymentMethod}
              isLoading={isLoading}
              className="lg:col-span-2"
            />
            
            {userRole === UserRole.CLIENT && (
              <ClientActions />
            )}
            
            {userRole === UserRole.ADMIN && (
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      Adicionar Novo Cliente
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Revisar Pagamentos Pendentes
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Gerar Relatório Mensal
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Configurar Comissões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {userRole === UserRole.ADMIN && (
            <AdminActionCards />
          )}
          
          <SalesTable
            sales={data.recentSales}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
