import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart } from "@/components/charts";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { formatCurrency } from "@/lib/utils";

const Reports = () => {
  // Sample data for demonstration
  const salesData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 18000 },
    { name: 'Jun', value: 25000 },
  ];

  const paymentStatusData = [
    { name: 'Pendente', value: 35, color: '#FFCC00' },
    { name: 'Aprovado', value: 45, color: '#0088FE' },
    { name: 'Pago', value: 15, color: '#00C49F' },
    { name: 'Rejeitado', value: 5, color: '#FF8042' },
  ];

  const partnerData = [
    { name: 'Partner A', value: 40, color: '#8884d8' },
    { name: 'Partner B', value: 30, color: '#82ca9d' },
    { name: 'Partner C', value: 20, color: '#ffc658' },
    { name: 'Others', value: 10, color: '#ff8042' },
  ];

  return (
    <>
      <PageHeader 
        title="Relatórios" 
        description="Visualize dados e estatísticas do sistema"
      />

      <PageWrapper>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="partners">Parceiros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(128750)}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagamentos Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(35420)}</div>
                  <p className="text-xs text-muted-foreground">
                    12 solicitações aguardando aprovação
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Novos Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+28</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Status de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PieChart data={paymentStatusData} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Parceiros</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PieChart data={partnerData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {/* Payment analysis charts would go here */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Dados detalhados de pagamentos serão exibidos aqui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="partners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho de Parceiros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {/* Partner performance charts would go here */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Dados de desempenho de parceiros serão exibidos aqui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
};

export default Reports;
