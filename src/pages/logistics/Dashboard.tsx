
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import {
  CalendarIcon,
  ChartBarIcon,
  ClipboardListIcon,
  ListIcon,
  PackageIcon,
  RefreshCcw,
  Settings,
  Truck,
  Users
} from "lucide-react";
import SLAChart from "@/components/logistics/dashboard/SLAChart";
import RequestsChart from "@/components/logistics/dashboard/RequestsChart";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RequestsDataTable from "@/components/logistics/reports/RequestsDataTable";

const LogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for charts
  const slaData = [
    { name: "Janeiro", value: 95 },
    { name: "Fevereiro", value: 92 },
    { name: "Março", value: 88 },
    { name: "Abril", value: 94 },
    { name: "Maio", value: 97 },
    { name: "Junho", value: 91 }
  ];
  
  const requestsData = [
    { name: "Manutenção Jan", value: 23, total: 23 },
    { name: "Manutenção Fev", value: 28, total: 28 },
    { name: "Manutenção Mar", value: 25, total: 25 },
    { name: "Manutenção Abr", value: 31, total: 31 },
    { name: "Manutenção Mai", value: 27, total: 27 },
    { name: "Manutenção Jun", value: 29, total: 29 },
    { name: "Instalação Jan", value: 12, total: 12 },
    { name: "Instalação Fev", value: 15, total: 15 },
    { name: "Instalação Mar", value: 18, total: 18 },
    { name: "Instalação Abr", value: 14, total: 14 },
    { name: "Instalação Mai", value: 16, total: 16 },
    { name: "Instalação Jun", value: 19, total: 19 }
  ];
  
  const machineStatusData = [
    { name: "Ativas", value: 65, color: "#10B981" },
    { name: "Manutenção", value: 15, color: "#F59E0B" },
    { name: "Inativas", value: 8, color: "#EF4444" },
    { name: "Estoque", value: 12, color: "#6366F1" }
  ];
  
  const requestTypeData = [
    { name: "Manutenção", value: 45, color: "#3B82F6" },
    { name: "Instalação", value: 25, color: "#10B981" },
    { name: "Substituição", value: 15, color: "#F59E0B" },
    { name: "Suprimentos", value: 10, color: "#8B5CF6" },
    { name: "Outros", value: 5, color: "#6B7280" }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard de Logística" 
        description="Visão geral de operações, equipamentos e solicitações de suporte"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="machines">Equipamentos</TabsTrigger>
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 3 meses</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Máquinas
                </CardTitle>
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">192</div>
                <p className="text-xs text-muted-foreground">
                  +6 no último mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Solicitações Abertas
                </CardTitle>
                <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  8 de alta prioridade
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Resolução
                </CardTitle>
                <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94,2%</div>
                <p className="text-xs text-muted-foreground">
                  +2,1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  SLA Médio
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,3d</div>
                <p className="text-xs text-muted-foreground">
                  -0,5d em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <SLAChart data={slaData} />
            <RequestsChart data={requestsData} />
          </div>
          
          {/* Status Charts */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status de Equipamentos</CardTitle>
                <CardDescription>
                  Distribuição atual das máquinas por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart 
                  data={machineStatusData}
                  dataKey="value"
                  height={280}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Solicitações</CardTitle>
                <CardDescription>
                  Distribuição por tipo de solicitação nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart 
                  data={requestTypeData}
                  dataKey="value"
                  height={280}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="machines" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestão de Equipamentos</CardTitle>
                  <CardDescription>
                    Monitore o status de todas as máquinas no sistema
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Truck className="h-4 w-4 mr-2" />
                    Transferência
                  </Button>
                  <Button size="sm">
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Nova Máquina
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Machine Management Content would go here */}
              <p className="text-center py-20 text-muted-foreground">
                Conteúdo da gestão de equipamentos
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Solicitações de Suporte</CardTitle>
                  <CardDescription>
                    Gerencie todas as solicitações de suporte e manutenção
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Técnicos
                  </Button>
                  <Button size="sm">
                    <ClipboardListIcon className="h-4 w-4 mr-2" />
                    Nova Solicitação
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RequestsDataTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendário de Agendamentos</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todos os agendamentos de serviço
                  </CardDescription>
                </div>
                <Button size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar content would go here */}
              <p className="text-center py-20 text-muted-foreground">
                Calendário de agendamentos
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsDashboard;
