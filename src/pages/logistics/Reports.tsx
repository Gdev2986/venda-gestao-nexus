
import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronDown, Download, FileDown, Filter, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RequestsDataTable from "@/components/logistics/reports/RequestsDataTable";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import RequestsPieChart from "@/components/logistics/reports/RequestsPieChart";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { BarChart } from "@/components/charts";

const LogisticsReports = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [dateRange, setDateRange] = useState("30d");
  
  // Mock data for request statistics
  const requestStats = {
    pendingRequests: 18,
    highPriorityRequests: 7,
    typeCounts: {
      INSTALLATION: 12,
      MAINTENANCE: 23,
      REPLACEMENT: 5,
      SUPPLIES: 8,
      OTHER: 4
    }
  };
  
  // Mock data for charts
  const requestTypeChartData = [
    { name: "Manutenção", value: 23, color: "#3B82F6" },
    { name: "Instalação", value: 12, color: "#10B981" },
    { name: "Substituição", value: 5, color: "#F59E0B" },
    { name: "Suprimentos", value: 8, color: "#8B5CF6" },
    { name: "Outros", value: 4, color: "#6B7280" }
  ];
  
  const slaPerformanceData = [
    { name: "Dentro do prazo", value: 42, color: "#10B981" },
    { name: "Fora do prazo", value: 10, color: "#EF4444" }
  ];
  
  const technicianPerformanceData = [
    { name: "João Silva", value: 95 },
    { name: "Maria Oliveira", value: 88 },
    { name: "Pedro Santos", value: 92 },
    { name: "Ana Costa", value: 97 },
    { name: "Carlos Lima", value: 85 }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios de Logística" 
        description="Visualize e analise dados de operações, equipamentos e solicitações"
      />
      
      <div className="flex items-center justify-between">
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="requests">Solicitações</TabsTrigger>
              <TabsTrigger value="machines">Equipamentos</TabsTrigger>
              <TabsTrigger value="technicians">Técnicos</TabsTrigger>
              <TabsTrigger value="inventory">Estoque</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 3 meses</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="requests" className="space-y-6 mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Solicitações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">52</div>
                  <p className="text-xs text-muted-foreground">
                    +8 em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Solicitações Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{requestStats.pendingRequests}</div>
                  <p className="text-xs text-muted-foreground">
                    {requestStats.highPriorityRequests} de alta prioridade
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tempo Médio de Resolução
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,5 dias</div>
                  <p className="text-xs text-muted-foreground">
                    -0,3 dias que o período anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de SLA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">
                    +2% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <RequestsReportView 
                  pendingRequests={requestStats.pendingRequests}
                  highPriorityRequests={requestStats.highPriorityRequests}
                  typeCounts={requestStats.typeCounts}
                />
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Tipo</CardTitle>
                    <CardDescription>Total de solicitações por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DoughnutChart
                        data={requestTypeChartData}
                        dataKey="value"
                        height={250}
                      />
                      <DoughnutChart
                        data={slaPerformanceData}
                        title="Performance SLA"
                        dataKey="value"
                        height={250}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance de Técnicos</CardTitle>
                  <CardDescription>
                    Taxa de SLA por técnico (% de solicitações resolvidas dentro do prazo)
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <BarChart data={technicianPerformanceData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Histórico de Solicitações</CardTitle>
                  <CardDescription>
                    Lista detalhada de todas as solicitações no período
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <RequestsDataTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machines" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Equipamentos</CardTitle>
                <CardDescription>
                  Análise de performance e status de equipamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="py-10">
                <p className="text-center text-muted-foreground">
                  Conteúdo do relatório de equipamentos
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technicians" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Técnicos</CardTitle>
                <CardDescription>
                  Performance e produtividade da equipe técnica
                </CardDescription>
              </CardHeader>
              <CardContent className="py-10">
                <p className="text-center text-muted-foreground">
                  Conteúdo do relatório de técnicos
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Estoque</CardTitle>
                <CardDescription>
                  Análise de inventário e consumo de materiais
                </CardDescription>
              </CardHeader>
              <CardContent className="py-10">
                <p className="text-center text-muted-foreground">
                  Conteúdo do relatório de estoque
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LogisticsReports;
