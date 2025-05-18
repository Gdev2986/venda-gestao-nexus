
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachines } from "@/hooks/logistics/use-machines";
import { useSupportTickets } from "@/hooks/logistics/use-support-tickets";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { TicketStatus, TicketPriority } from "@/types/support.types";

const LogisticsDashboard = () => {
  const { machines, stats, isLoading: machinesLoading } = useMachines({
    enableRealtime: true,
    initialFetch: true,
  });
  
  const { 
    tickets, 
    isLoading: ticketsLoading, 
    getPendingTicketsCount 
  } = useSupportTickets();
  
  const [todayTicketsCount, setTodayTicketsCount] = useState(0);
  
  useEffect(() => {
    if (tickets.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayCount = tickets.filter(ticket => 
        ticket.created_at.startsWith(today) && 
        ticket.status === TicketStatus.PENDING
      ).length;
      setTodayTicketsCount(todayCount);
    }
  }, [tickets]);
  
  // Calculate SLA metrics (mock data)
  const slaData = {
    average: 1.5, // days
    goal: 2.0,  // days
    withinSla: 85 // percentage
  };
  
  // Generate monthly request data (mock)
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  
  const monthlyRequestsData = Array(6).fill(0).map((_, i) => {
    const monthIndex = (currentMonth - 5 + i) % 12;
    const month = monthNames[monthIndex];
    return {
      month,
      requests: Math.floor(Math.random() * 25) + 5
    };
  });
  
  // Generate machine status data
  const statusColors = {
    "ACTIVE": "#34D399", // green
    "INACTIVE": "#F87171", // red
    "MAINTENANCE": "#FBBF24", // yellow
    "STOCK": "#60A5FA", // blue
    "TRANSIT": "#A78BFA" // purple
  };
  
  const statusLabels = {
    "ACTIVE": "Operando",
    "INACTIVE": "Inativa",
    "MAINTENANCE": "Em Manutenção",
    "STOCK": "Em Estoque",
    "TRANSIT": "Em Trânsito"
  };
  
  const getMachineStatusData = () => {
    if (!stats || machinesLoading) return [];
    
    return Object.entries(stats.byStatus || {}).map(([status, count]) => ({
      name: statusLabels[status as keyof typeof statusLabels] || status,
      value: count as number,
      status
    }));
  };
  
  const machineStatusData = getMachineStatusData();
  
  // Generate recent activities (mock)
  const recentActivities = [
    { id: 1, text: "Máquina SN-100008 foi adicionada ao estoque", time: "Hoje, 10:30" },
    { id: 2, text: "Solicitação #4432 foi marcada como concluída", time: "Hoje, 09:15" },
    { id: 3, text: "Máquina SN-100007 foi transferida para Cliente ABC", time: "Ontem, 16:45" },
    { id: 4, text: "Nova solicitação #4435 de manutenção criada", time: "Ontem, 14:20" },
    { id: 5, text: "Máquina SN-100005 em manutenção", time: "21/05/2025, 11:30" }
  ];
  
  // Generate upcoming appointments (mock)
  const upcomingAppointments = [
    { id: 1, client: "Supermercado ABC", type: "Instalação", date: "25/05/2025" },
    { id: 2, client: "Farmácia São José", type: "Manutenção", date: "26/05/2025" },
    { id: 3, client: "Restaurante Sabor Caseiro", type: "Troca", date: "27/05/2025" },
    { id: 4, client: "Padaria Bom Pão", type: "Instalação", date: "28/05/2025" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Logística" 
        description="Acompanhe as métricas, solicitações e equipamentos"
      />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Máquinas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {machinesLoading ? "..." : stats?.total || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Máquinas Operando
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {machinesLoading ? "..." : stats?.byStatus?.ACTIVE || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {machinesLoading ? "" : stats?.byStatus?.ACTIVE && stats?.total
                    ? `${Math.round((stats.byStatus.ACTIVE / stats.total) * 100)}% do total`
                    : "0% do total"
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Solicitações Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ticketsLoading ? "..." : getPendingTicketsCount()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {ticketsLoading ? "" : `${todayTicketsCount} novas hoje`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  SLA Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {slaData.average} dias
                </div>
                <p className="text-xs text-muted-foreground">
                  Meta: {slaData.goal} dias
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts and Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Machine Status Pie Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Status das Máquinas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {machineStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={machineStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {machineStatusData.map((entry) => (
                            <Cell 
                              key={entry.status} 
                              fill={statusColors[entry.status as keyof typeof statusColors] || "#9CA3AF"} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `${value} máquina${value > 1 ? 's' : ''}`, 
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      {machinesLoading ? "Carregando..." : "Sem dados disponíveis"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Requests Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Solicitações Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRequestsData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="requests" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Secondary Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Últimas Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="text-sm">{activity.text}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* SLA Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-green-500">{slaData.withinSla}%</div>
                  <p className="text-sm text-muted-foreground">
                    das solicitações atendidas dentro do prazo
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6 dark:bg-gray-700">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${slaData.withinSla}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between w-full mt-2 text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>Meta: 90%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{appointment.client}</p>
                        <span className="text-xs text-muted-foreground">{appointment.type}</span>
                      </div>
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de solicitações será implementado em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da aba de relatórios será implementado em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsDashboard;
