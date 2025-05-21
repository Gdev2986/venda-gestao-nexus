
import { useState } from 'react';
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Box, 
  Calendar as CalendarIcon,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/format";

// Sample data
const requestsByType = [
  { name: "Instalação", value: 35, color: "#4CAF50" },
  { name: "Manutenção", value: 45, color: "#2196F3" },
  { name: "Retirada", value: 10, color: "#FF5722" },
  { name: "Suprimentos", value: 10, color: "#9C27B0" }
];

const dailyOperations = [
  { date: "Segunda", value: 8 },
  { date: "Terça", value: 12 },
  { date: "Quarta", value: 10 },
  { date: "Quinta", value: 15 },
  { date: "Sexta", value: 9 },
  { date: "Sábado", value: 5 }
];

const upcomingRequests = [
  { id: 1, client: "Empresa ABC", type: "Instalação", date: "2025-05-22", address: "Av. Paulista, 1000" },
  { id: 2, client: "Loja XYZ", type: "Manutenção", date: "2025-05-23", address: "Rua Augusta, 500" },
  { id: 3, client: "Restaurante 123", type: "Suprimentos", date: "2025-05-23", address: "Alameda Santos, 45" },
  { id: 4, client: "Farmácia ABC", type: "Retirada", date: "2025-05-24", address: "Av. Rebouças, 1200" },
  { id: 5, client: "Mercado XYZ", type: "Instalação", date: "2025-05-25", address: "Rua Oscar Freire, 123" }
];

const machineStatusData = [
  { name: "Ativas", value: 245, color: "#4CAF50" },
  { name: "Inativas", value: 30, color: "#F44336" },
  { name: "Em manutenção", value: 15, color: "#FFC107" },
  { name: "Em estoque", value: 50, color: "#2196F3" }
];

const LogisticsDashboard = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel de Logística"
        description="Visão geral das operações, solicitações e máquinas"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardDescription>Solicitações</CardDescription>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">124</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" /> 
              12% este mês
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardDescription>Operações Concluídas</CardDescription>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">87</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" /> 
              8% este mês
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardDescription>Tempo Médio</CardDescription>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">3.5h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowDown className="h-3 w-3 text-green-500 mr-1" /> 
              0.2h melhor
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardDescription>Máquinas Ativas</CardDescription>
              <Box className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">245</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" /> 
              15 novas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="requests">
            <ClipboardList className="mr-2 h-4 w-4" />
            Solicitações
          </TabsTrigger>
          <TabsTrigger value="machines">
            <Box className="mr-2 h-4 w-4" />
            Máquinas
          </TabsTrigger>
          <TabsTrigger value="operations">
            <Truck className="mr-2 h-4 w-4" />
            Operações
          </TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Solicitações por Tipo
                </CardTitle>
                <CardDescription>Distribuição das solicitações recebidas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={requestsByType} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Operações Diárias
                </CardTitle>
                <CardDescription>Última semana</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={dailyOperations}
                  height={300}
                  color="#2196F3"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Próximas Solicitações
              </CardTitle>
              <CardDescription>Agendamentos para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.client}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{format(new Date(request.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{request.address}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* REQUESTS TAB */}
        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tendência de Solicitações</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={[
                    { month: "Jan", value: 65 },
                    { month: "Fev", value: 59 },
                    { month: "Mar", value: 80 },
                    { month: "Abr", value: 81 },
                    { month: "Mai", value: 95 },
                    { month: "Jun", value: 87 }
                  ]}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
                <CardDescription>Solicitações agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Solicitações por Status</CardTitle>
              <CardDescription>Visão geral dos status atuais</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={[
                  { name: "Pendente", value: 35 },
                  { name: "Em andamento", value: 45 },
                  { name: "Concluído", value: 78 },
                  { name: "Cancelado", value: 12 }
                ]}
                height={300}
                color="#FFA000"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* MACHINES TAB */}
        <TabsContent value="machines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status das Máquinas</CardTitle>
                <CardDescription>Visão geral do parque instalado</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={machineStatusData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Instalações por Mês</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Jan", value: 14 },
                    { name: "Fev", value: 17 },
                    { name: "Mar", value: 21 },
                    { name: "Abr", value: 15 },
                    { name: "Mai", value: 19 },
                    { name: "Jun", value: 16 }
                  ]}
                  height={300}
                  color="#4CAF50"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Máquinas</CardTitle>
              <CardDescription>Distribuição por modelo</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={[
                  { name: "SigmaPay S920", value: 145 },
                  { name: "SigmaPay Mini", value: 87 },
                  { name: "SigmaPay Pro", value: 65 },
                  { name: "SigmaPay Mobile", value: 43 }
                ]}
                height={300}
                color="#2196F3"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* OPERATIONS TAB */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Técnico</CardTitle>
                <CardDescription>Atendimentos realizados</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Técnico A", value: 28 },
                    { name: "Técnico B", value: 22 },
                    { name: "Técnico C", value: 19 },
                    { name: "Técnico D", value: 15 },
                    { name: "Técnico E", value: 12 }
                  ]}
                  height={300}
                  color="#9C27B0"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio por Operação</CardTitle>
                <CardDescription>Em horas</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Instalação", value: 2.5 },
                    { name: "Manutenção", value: 3.8 },
                    { name: "Retirada", value: 1.2 },
                    { name: "Suprimentos", value: 0.8 }
                  ]}
                  height={300}
                  color="#FF5722"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Regiões com Mais Operações</CardTitle>
              <CardDescription>Top 5 cidades</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={[
                  { name: "São Paulo", value: 85 },
                  { name: "Rio de Janeiro", value: 45 },
                  { name: "Belo Horizonte", value: 32 },
                  { name: "Brasília", value: 28 },
                  { name: "Curitiba", value: 22 }
                ]}
                height={300}
                color="#00BCD4"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsDashboard;
