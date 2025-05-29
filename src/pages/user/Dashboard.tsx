
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Activity,
  Calendar,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Bell
} from "lucide-react";

const UserDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    balance: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    activeMachines: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      balance: 12450.00,
      monthlyRevenue: 8720.00,
      totalTransactions: 156,
      activeMachines: 8
    });
  }, []);

  const quickActions = [
    {
      title: "Realizar Pagamento",
      description: "Faça um novo pagamento ou transfira valores",
      icon: CreditCard,
      onClick: () => navigate(PATHS.CLIENT.PAYMENTS),
      variant: "default" as const
    },
    {
      title: "Gerenciar Máquinas",
      description: "Visualize e gerencie suas máquinas",
      icon: Users,
      onClick: () => navigate(PATHS.CLIENT.MACHINES),
      variant: "outline" as const
    },
    {
      title: "Relatórios",
      description: "Acesse relatórios detalhados",
      icon: BarChart3,
      onClick: () => navigate(PATHS.CLIENT.REPORTS),
      variant: "outline" as const
    },
    {
      title: "Configurações",
      description: "Atualize suas preferências",
      icon: Settings,
      onClick: () => navigate(PATHS.CLIENT.SETTINGS),
      variant: "outline" as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      description: "Pagamento recebido - Terminal 001",
      amount: "R$ 450,00",
      time: "2 horas atrás",
      status: "completed"
    },
    {
      id: 2,
      type: "machine",
      description: "Nova máquina associada - Terminal 008",
      amount: "",
      time: "1 dia atrás",
      status: "active"
    },
    {
      id: 3,
      type: "report",
      description: "Relatório mensal gerado",
      amount: "",
      time: "2 dias atrás",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.email || "Usuário"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{userRole}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(PATHS.CLIENT.SUPPORT)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Suporte
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground">+5.2% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">+12.1% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+8.3% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMachines}</div>
            <p className="text-xs text-muted-foreground">+2 novas este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="actions">Ações Rápidas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Suas últimas transações e atividades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="text-sm font-bold text-green-600">{activity.amount}</p>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {activity.status === 'completed' ? 'Concluído' : 'Ativo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo do Período
                </CardTitle>
                <CardDescription>
                  Performance dos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total de Vendas</span>
                    <span className="font-bold">R$ 28.450,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Número de Transações</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ticket Médio</span>
                    <span className="font-bold">R$ 182,37</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Crescimento</span>
                    <span className="font-bold text-green-600">+8.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico Completo de Atividades</CardTitle>
              <CardDescription>
                Visualize todas as suas transações e atividades recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.concat([
                  {
                    id: 4,
                    type: "payment",
                    description: "Pagamento recebido - Terminal 003",
                    amount: "R$ 320,00",
                    time: "3 dias atrás",
                    status: "completed"
                  },
                  {
                    id: 5,
                    type: "support",
                    description: "Ticket de suporte resolvido",
                    amount: "",
                    time: "5 dias atrás",
                    status: "completed"
                  }
                ]).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="text-sm font-bold text-green-600">{activity.amount}</p>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {activity.status === 'completed' ? 'Concluído' : 'Ativo'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesse as principais funcionalidades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    onClick={action.onClick}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <action.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-70">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
