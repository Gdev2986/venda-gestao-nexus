
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/page/PageHeader";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users 
} from "lucide-react";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";

const AdminReports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [isLoading, setIsLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    companyStats: {
      totalRevenue: 152850.75,
      totalClients: 45,
      totalSales: 1243,
      growthRate: 12.3
    },
    expensesByCategory: [
      { name: "Operacional", value: 25000, color: "#4ade80" },
      { name: "Marketing", value: 15000, color: "#60a5fa" },
      { name: "Logística", value: 12000, color: "#f97316" },
      { name: "Impostos", value: 18000, color: "#f43f5e" },
      { name: "Outros", value: 8000, color: "#a78bfa" }
    ],
    monthlySales: [
      { name: "Jan", value: 8500 },
      { name: "Fev", value: 7200 },
      { name: "Mar", value: 9000 },
      { name: "Abr", value: 8800 },
      { name: "Mai", value: 11500 },
      { name: "Jun", value: 10200 }
    ],
    clientAcquisition: [
      { name: "Jan", value: 3 },
      { name: "Fev", value: 5 },
      { name: "Mar", value: 2 },
      { name: "Abr", value: 7 },
      { name: "Mai", value: 4 },
      { name: "Jun", value: 6 }
    ]
  });

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Análise detalhada de desempenho e finanças da empresa"
      />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="finances">Finanças</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
        
        {/* Resumo da Empresa */}
        <TabsContent value="summary" className="space-y-6">
          {/* Indicadores principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(reportsData.companyStats.totalRevenue)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportsData.companyStats.totalClients}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportsData.companyStats.totalSales}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  +{reportsData.companyStats.growthRate}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas Mensais</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded" />
                ) : (
                  <LineChart 
                    data={reportsData.monthlySales}
                    xAxisKey="name"
                    dataKey="value"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aquisição de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded" />
                ) : (
                  <BarChart 
                    data={reportsData.clientAcquisition}
                    xAxisKey="name"
                    dataKey="value"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Finanças */}
        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 bg-muted/20 animate-pulse rounded" />
              ) : (
                <div className="h-80">
                  <LineChart 
                    data={reportsData.monthlySales}
                    xAxisKey="name"
                    dataKey="value"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Clientes */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 bg-muted/20 animate-pulse rounded" />
              ) : (
                <div className="h-80">
                  <BarChart 
                    data={reportsData.clientAcquisition}
                    xAxisKey="name"
                    dataKey="value"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Despesas */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 bg-muted/20 animate-pulse rounded" />
              ) : (
                <div className="h-80">
                  <DoughnutChart 
                    data={reportsData.expensesByCategory}
                    dataKey="value"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
