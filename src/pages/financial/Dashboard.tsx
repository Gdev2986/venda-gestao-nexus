
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const FinancialDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para gráficos
  const salesChartData = [
    { name: "Jan", total: 900 },
    { name: "Fev", total: 1200 },
    { name: "Mar", total: 900 },
    { name: "Abr", total: 1600 },
    { name: "Mai", total: 1800 },
    { name: "Jun", total: 1400 },
  ];

  const paymentMethodData = [
    { name: "PIX", value: 60 },
    { name: "Crédito", value: 30 },
    { name: "Débito", value: 10 },
  ];

  const clientGrowthData = [
    { name: "Jan", active: 12, inactive: 3 },
    { name: "Fev", active: 15, inactive: 2 },
    { name: "Mar", active: 18, inactive: 4 },
    { name: "Abr", active: 22, inactive: 5 },
    { name: "Mai", active: 28, inactive: 3 },
    { name: "Jun", active: 32, inactive: 4 },
  ];

  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Dashboard Financeiro" 
        description="Visão geral do sistema financeiro"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-36" />
            ) : (
              <div className="text-2xl font-bold">
                R$ 320.500,00
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +12,3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-36" />
            ) : (
              <div className="text-2xl font-bold">
                216
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +5 novos clientes este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagamentos Processados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-36" />
            ) : (
              <div className="text-2xl font-bold">
                3.204
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +18,2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissões Pagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-36" />
            ) : (
              <div className="text-2xl font-bold">
                R$ 28.450,00
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              +8,4% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="clients">Crescimento de Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento Mensal</CardTitle>
                <CardDescription>
                  Análise do faturamento nos últimos 6 meses.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <BarChart data={salesChartData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>
                  Distribuição dos métodos de pagamento utilizados.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-80">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <PieChart data={paymentMethodData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
                <CardDescription>
                  Evolução da base de clientes ativos e inativos.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <LineChart data={clientGrowthData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinancialDashboard;
