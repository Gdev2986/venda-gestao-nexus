import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import other components as needed

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");
  
  // Use the new utility functions for data
  const dailySalesData = generateDailySalesData();
  const paymentMethodsData = generatePaymentMethodsData();
  
  // Sample metrics
  const metrics = {
    totalSales: 12450.75,
    salesCount: 142,
    averageTicket: 87.68,
    conversionRate: 3.2
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas vendas e métricas de desempenho
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <select 
              className="text-sm border rounded p-1"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="12m">Últimos 12 meses</option>
            </select>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Overview metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(metrics.totalSales)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.salesCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12.5% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(metrics.averageTicket)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5.2% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.conversionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  +1.1% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts would go here */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendas Diárias</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Sales chart would go here */}
                <div className="flex items-center justify-center h-full border border-dashed rounded">
                  <p className="text-muted-foreground">Gráfico de vendas diárias</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Payment methods chart would go here */}
                <div className="flex items-center justify-center h-full border border-dashed rounded">
                  <p className="text-muted-foreground">Gráfico de métodos de pagamento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tabela de vendas seria exibida aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Informações de clientes seriam exibidas aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
