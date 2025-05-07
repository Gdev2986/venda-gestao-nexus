
import { useState, useEffect } from "react";
import { useMachineStats } from "@/hooks/use-machine-stats";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PieChart, BarChart, LineChart } from "@/components/charts";
import { CalendarIcon, RefreshCw, PlusCircle, AlertTriangle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for charts
const machineStatusData = [
  { name: "Operando", value: 65 },
  { name: "Em Estoque", value: 20 },
  { name: "Em Manutenção", value: 10 },
  { name: "Inativa", value: 5 }
];

const requestsMonthlyData = [
  { name: "Jan", value: 10, total: 10 },
  { name: "Fev", value: 15, total: 15 },
  { name: "Mar", value: 8, total: 8 },
  { name: "Abr", value: 22, total: 22 },
  { name: "Mai", value: 18, total: 18 },
  { name: "Jun", value: 12, total: 12 }
];

const slaData = [
  { name: "Instalação", value: 90 },
  { name: "Manutenção", value: 85 },
  { name: "Troca", value: 95 },
  { name: "Retirada", value: 75 }
];

const upcomingAppointments = [
  { id: 1, client: "Mercado Central", type: "Instalação", date: "2025-05-09", status: "Agendado" },
  { id: 2, client: "Restaurante Sabores", type: "Manutenção", date: "2025-05-10", status: "Pendente" },
  { id: 3, client: "Farmácia Saúde", type: "Troca de Bobina", date: "2025-05-12", status: "Confirmado" }
];

const recentActivities = [
  { id: 1, description: "Máquina S/N 12345 instalada no cliente Mercado Central", timestamp: "Hoje, 10:30" },
  { id: 2, description: "Nova solicitação de manutenção do Restaurante Sabores", timestamp: "Hoje, 09:15" },
  { id: 3, description: "5 novas máquinas adicionadas ao estoque", timestamp: "Ontem, 16:45" },
  { id: 4, description: "Inventário atualizado: 50 bobinas adicionadas", timestamp: "Ontem, 14:20" },
  { id: 5, description: "Máquina S/N 98765 transferida para manutenção", timestamp: "22/04/2025, 11:10" }
];

const LogisticsDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const [isNewMachineDialogOpen, setIsNewMachineDialogOpen] = useState(false);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const { stats, isLoading, refreshStats } = useMachineStats(dateRange);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    refreshStats();
    toast({
      title: "Dados atualizados",
      description: "Os dados da dashboard foram atualizados com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Dashboard de Logística" 
          description="Visão consolidada de operações, máquinas e solicitações"
        />
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsNewMachineDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Nova Máquina
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsNewRequestDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Nova Solicitação
          </Button>
          <Button variant="default" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">↑ 12% desde o mês passado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Máquinas Operando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">76% do total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">10 atendimentos hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SLA Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5 dias</div>
            <p className="text-xs text-muted-foreground text-green-600">↓ Meta: 2 dias</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Principal content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs for main dashboard views */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="machines">Máquinas</TabsTrigger>
              <TabsTrigger value="requests">Solicitações</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Status charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status das Máquinas</CardTitle>
                    <CardDescription>Distribuição por status atual</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <PieChart data={machineStatusData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Solicitações Mensais</CardTitle>
                    <CardDescription>Tendência dos últimos 6 meses</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <LineChart data={requestsMonthlyData} />
                  </CardContent>
                </Card>
              </div>
              
              {/* SLA */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance SLA</CardTitle>
                  <CardDescription>% de solicitações atendidas dentro do prazo</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={slaData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Machines Tab */}
            <TabsContent value="machines">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resumo de Máquinas</span>
                    <Button variant="outline" size="sm">Ver Todas</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Local</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>SN-100001</TableCell>
                        <TableCell>Terminal Pro</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                            Operando
                          </span>
                        </TableCell>
                        <TableCell>Cliente ABC</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SN-100002</TableCell>
                        <TableCell>Terminal Standard</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                            Em Manutenção
                          </span>
                        </TableCell>
                        <TableCell>Centro Técnico</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SN-100003</TableCell>
                        <TableCell>Terminal Pro</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                            Em Estoque
                          </span>
                        </TableCell>
                        <TableCell>Depósito Central</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Requests Tab */}
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Solicitações Recentes</span>
                    <Button variant="outline" size="sm">Ver Todas</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Empresa A</TableCell>
                        <TableCell>Instalação</TableCell>
                        <TableCell>15/05/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                            Pendente
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Empresa B</TableCell>
                        <TableCell>Manutenção</TableCell>
                        <TableCell>16/05/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                            Agendado
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Empresa C</TableCell>
                        <TableCell>Retirada</TableCell>
                        <TableCell>17/05/2025</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                            Concluído
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar content - 1/3 width */}
        <div className="space-y-6">
          {/* Mini calendar and upcoming appointments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Próximos Atendimentos</CardTitle>
              <CardDescription>Agenda da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>{format(new Date(), "MMMM yyyy")}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{appointment.client}</h4>
                        <p className="text-xs text-muted-foreground">{appointment.type}</p>
                      </div>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        appointment.status === "Agendado" ? "bg-blue-50 text-blue-700" :
                        appointment.status === "Confirmado" ? "bg-green-50 text-green-700" :
                        "bg-yellow-50 text-yellow-700"
                      )}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{format(new Date(appointment.date), "dd/MM/yyyy")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Últimas Atividades</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[350px] overflow-auto">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-sm">{activity.description}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Machine Dialog */}
      <Dialog open={isNewMachineDialogOpen} onOpenChange={setIsNewMachineDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Máquina</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar uma nova máquina ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">Terminal Pro</SelectItem>
                    <SelectItem value="standard">Terminal Standard</SelectItem>
                    <SelectItem value="mini">Terminal Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial">Número de Série</Label>
                <Input id="serial" placeholder="Ex: SN-10xxxx" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Em Estoque</SelectItem>
                  <SelectItem value="client">Alocada para Cliente</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Cliente (opcional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente1">Cliente ABC</SelectItem>
                  <SelectItem value="cliente2">Cliente DEF</SelectItem>
                  <SelectItem value="cliente3">Cliente GHI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewMachineDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsNewMachineDialogOpen(false);
              toast({
                title: "Máquina cadastrada",
                description: "A máquina foi cadastrada com sucesso."
              });
            }}>
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Request Dialog */}
      <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Solicitação</DialogTitle>
            <DialogDescription>
              Crie uma nova solicitação de atendimento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requestType">Tipo de Solicitação</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installation">Instalação</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="paper">Troca de Bobina</SelectItem>
                  <SelectItem value="removal">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente1">Cliente ABC</SelectItem>
                  <SelectItem value="cliente2">Cliente DEF</SelectItem>
                  <SelectItem value="cliente3">Cliente GHI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data Desejada</Label>
              <Input type="date" id="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" placeholder="Detalhes da solicitação..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRequestDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsNewRequestDialogOpen(false);
              toast({
                title: "Solicitação criada",
                description: "A solicitação foi criada com sucesso."
              });
            }}>
              Criar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogisticsDashboard;
