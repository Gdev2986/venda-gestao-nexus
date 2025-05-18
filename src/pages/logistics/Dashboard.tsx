
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useMachines } from "@/hooks/logistics/use-machines";
import { useSupportTickets } from "@/hooks/logistics/use-support-tickets";
import { Plus, RefreshCcw, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import NewRequestDialog from "@/components/logistics/modals/NewRequestDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const LogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats: machineStats, isLoading: machinesLoading } = useMachines({ enableRealtime: true });
  const { tickets, stats: ticketStats, isLoading: ticketsLoading } = useSupportTickets({ enableRealtime: true });
  
  const newMachineDialog = useDialog();
  const newRequestDialog = useDialog();
  
  // Mock data for activity logs
  const recentActivities = [
    { id: 1, description: "Máquina SN-100042 foi adicionada ao estoque", timestamp: new Date().toISOString() },
    { id: 2, description: "Solicitação #4432 foi marcada como concluída", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, description: "Cliente ABC recebeu nova máquina", timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];
  
  // Mock data for monthly requests
  const monthlyRequestsData = [
    { name: 'Jan', total: 24 },
    { name: 'Fev', total: 18 },
    { name: 'Mar', total: 25 },
    { name: 'Abr', total: 22 },
    { name: 'Mai', total: 30 },
    { name: 'Jun', total: 27 },
  ];
  
  // Mock data for SLA performance
  const slaData = [
    { name: 'Dentro do SLA', value: 85, color: '#22c55e' },
    { name: 'Fora do SLA', value: 15, color: '#ef4444' },
  ];
  
  // Get upcoming appointments from tickets
  const upcomingAppointments = tickets
    .filter(ticket => 
      ticket.scheduled_date && 
      new Date(ticket.scheduled_date) > new Date() &&
      ticket.status !== 'RESOLVED' && 
      ticket.status !== 'CANCELLED'
    )
    .sort((a, b) => 
      new Date(a.scheduled_date as string).getTime() - new Date(b.scheduled_date as string).getTime()
    )
    .slice(0, 5);
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "LOW":
        return <Badge className="bg-blue-100 text-blue-800">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
      case "ASSIGNED":
        return <Badge className="bg-purple-100 text-purple-800">Atribuída</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-800">Resolvida</Badge>;
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-800">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getRequestTypeName = (type: string): string => {
    switch (type) {
      case 'INSTALLATION': return 'Instalação';
      case 'MAINTENANCE': return 'Manutenção';
      case 'REMOVAL': return 'Retirada';
      case 'REPLACEMENT': return 'Substituição';
      case 'PAPER': return 'Troca de Bobina';
      case 'OTHER': return 'Outro';
      default: return type;
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    return format(new Date(dateStr), 'dd/MM/yyyy');
  };
  
  // Get machine status data for chart
  const machineStatusData = machineStats ? [
    { name: 'Operando', value: machineStats.byStatus?.ACTIVE || 0, color: '#22c55e' },
    { name: 'Manutenção', value: machineStats.byStatus?.MAINTENANCE || 0, color: '#f59e0b' },
    { name: 'Inativas', value: machineStats.byStatus?.INACTIVE || 0, color: '#ef4444' },
    { name: 'Em Estoque', value: machineStats.byStatus?.STOCK || 0, color: '#3b82f6' },
    { name: 'Em Trânsito', value: machineStats.byStatus?.TRANSIT || 0, color: '#8b5cf6' },
  ] : [];
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard de Logística" 
        description="Visão geral do sistema de gerenciamento de máquinas e solicitações"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button variant="outline" onClick={newRequestDialog.open}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Button>
            <Button onClick={newMachineDialog.open}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Máquina
            </Button>
          </div>
        }
      />
      
      {/* Main Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Máquinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {machinesLoading ? "..." : machineStats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {machineStats?.withClients || 0} com clientes • {machineStats?.stock || 0} em estoque
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Máquinas Operando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {machinesLoading ? "..." : machineStats?.byStatus?.ACTIVE || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {machineStats && machineStats.total > 0 
                ? `${Math.round(((machineStats?.byStatus?.ACTIVE || 0) / machineStats.total) * 100)}% do total`
                : "0% do total"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ticketsLoading ? "..." : ticketStats?.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ticketStats?.scheduledToday || 0} agendadas para hoje
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              SLA Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              1.5 dias
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 2 dias • {slaData[0].value}% dentro do SLA
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="machines">Máquinas</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* Machine Status Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Status das Máquinas</CardTitle>
                <CardDescription>Distribuição por status de operação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={machineStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {machineStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} máquinas`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Últimas Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Monthly Requests */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Solicitações Mensais</CardTitle>
                <CardDescription>Total de solicitações nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRequestsData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* SLA Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance SLA</CardTitle>
                <CardDescription>Solicitações atendidas dentro do prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={slaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {slaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Appointments */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Próximos Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.client?.business_name}</TableCell>
                          <TableCell>{getRequestTypeName(appointment.type)}</TableCell>
                          <TableCell>{formatDate(appointment.scheduled_date)}</TableCell>
                          <TableCell>{getPriorityBadge(appointment.priority)}</TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-10 text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">Não há atendimentos agendados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="machines">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Máquinas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de máquinas</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo detalhado de solicitações</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <NewMachineDialog 
        open={newMachineDialog.isOpen}
        onOpenChange={newMachineDialog.close}
      />
      
      <NewRequestDialog 
        open={newRequestDialog.isOpen}
        onOpenChange={newRequestDialog.close}
      />
    </div>
  );
};

export default LogisticsDashboard;
