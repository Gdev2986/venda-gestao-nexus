
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart } from "@/components/charts";

const FinancialDashboard = () => {
  // Sample data for financial dashboard
  const paymentMethodData = [
    { name: "PIX", value: 45 },
    { name: "Boleto", value: 25 },
    { name: "Cartão", value: 30 },
  ];

  const clientStatusData = [
    { name: "Ativos", value: 75 },
    { name: "Inativos", value: 15 },
    { name: "Pendentes", value: 10 },
  ];

  return (
    <div className="container py-8 max-w-7xl">
      <PageHeader
        title="Dashboard Financeiro"
        description="Visão geral das operações financeiras"
      />

      <div className="grid gap-6 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pagamentos do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 47.350,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.250,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                8 pagamentos aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5 novos clientes este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Payment Methods Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                  <CardDescription>
                    Distribuição por tipo de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <PieChart 
                    data={paymentMethodData}
                    dataKey="value"
                    nameKey="name"
                    height={250}
                    innerRadius={60}
                    outerRadius={80}
                  />
                </CardContent>
              </Card>

              {/* Client Status Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Status dos Clientes</CardTitle>
                  <CardDescription>
                    Distribuição por status de cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <PieChart 
                    data={clientStatusData}
                    dataKey="value"
                    nameKey="name"
                    height={250}
                    innerRadius={60}
                    outerRadius={80}
                  />
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>
                    Últimas operações financeiras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium">Pagamento Aprovado</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente: Empresa ABC
                        </p>
                      </div>
                      <div className="ml-auto font-medium">R$ 1.250,00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium">Pagamento Pendente</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente: Empresa XYZ
                        </p>
                      </div>
                      <div className="ml-auto font-medium">R$ 3.500,00</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium">Pagamento Rejeitado</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente: Empresa DEF
                        </p>
                      </div>
                      <div className="ml-auto font-medium">R$ 750,00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análises Financeiras</CardTitle>
                <CardDescription>
                  Análises detalhadas das operações financeiras
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {/* Analytics content will go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Dados de análise em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
                <CardDescription>
                  Relatórios e exportações de dados financeiros
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {/* Reports content will go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Relatórios em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinancialDashboard;
