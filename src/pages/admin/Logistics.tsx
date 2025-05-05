
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Package, Truck, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import RecentActivities from "@/components/dashboard/admin/RecentActivities";

// Mock data for machines
const MOCK_MACHINES = [
  { id: "1", serial: "SN-100001", model: "Terminal Pro", client: "Cliente ABC", status: "Instalada", lastUpdate: "22/04/2025" },
  { id: "2", serial: "SN-100002", model: "Terminal Standard", client: "Cliente XYZ", status: "Em Manutenção", location: "Centro Técnico", lastUpdate: "21/04/2025" },
  { id: "3", serial: "SN-100003", model: "Terminal Pro", client: "Em estoque", status: "Em Estoque", location: "Depósito Central", lastUpdate: "20/04/2025" },
  { id: "4", serial: "SN-100004", model: "Terminal Mini", client: "Em estoque", status: "Em Estoque", location: "Depósito Central", lastUpdate: "20/04/2025" },
  { id: "5", serial: "SN-100005", model: "Terminal Standard", client: "Cliente DEF", status: "Instalada", location: "Cliente DEF", lastUpdate: "19/04/2025" },
];

// Mock data for support requests
const MOCK_SUPPORT_REQUESTS = [
  { id: "1", client: "Cliente ABC", type: "Técnico", status: "Aberto", description: "Terminal não liga", date: "22/04/2025" },
  { id: "2", client: "Cliente XYZ", type: "Manutenção", status: "Em Andamento", description: "Impressora com papel preso", date: "21/04/2025" },
  { id: "3", client: "Cliente DEF", type: "Software", status: "Aguardando", description: "Erro ao processar pagamento", date: "20/04/2025" },
  { id: "4", client: "Cliente GHI", type: "Hardware", status: "Resolvido", description: "Tela touch não responde", date: "19/04/2025" },
  { id: "5", client: "Cliente JKL", type: "Suporte", status: "Aguardando Cliente", description: "Configuração de rede", date: "18/04/2025" },
];

// Mock data for deliveries
const MOCK_DELIVERIES = [
  { id: "1", date: "23/04/2025", time: "09:30 - 10:30", client: "Cliente ABC", address: "Av. Exemplo, 123", type: "Instalação", status: "Pendente" },
  { id: "2", date: "23/04/2025", time: "11:00 - 12:00", client: "Cliente XYZ", address: "Rua Teste, 456", type: "Manutenção", status: "Em rota" },
  { id: "3", date: "24/04/2025", time: "14:30 - 15:30", client: "Cliente DEF", address: "Rua Modelo, 789", type: "Entrega", status: "Pendente" },
  { id: "4", date: "24/04/2025", time: "16:00 - 17:00", client: "Cliente GHI", address: "Av. Padrão, 321", type: "Recolhimento", status: "Pendente" },
  { id: "5", date: "25/04/2025", time: "10:00 - 11:00", client: "Cliente JKL", address: "Rua Principal, 654", type: "Instalação", status: "Pendente" },
];

// Mock data for activities
const MOCK_ACTIVITIES = [
  { 
    id: "1", 
    title: "Nova máquina instalada", 
    description: "Terminal Pro instalado no Cliente ABC",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "client"
  },
  {
    id: "2",
    title: "Chamado técnico aberto",
    description: "Cliente XYZ relatou problema com impressora",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: "system"
  },
  {
    id: "3",
    title: "Entrega agendada",
    description: "Nova entrega agendada para Cliente DEF",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    type: "system"
  },
  {
    id: "4",
    title: "Máquina recolhida",
    description: "Terminal Standard recolhido do Cliente GHI",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    type: "client"
  }
];

const AdminLogistics = () => {
  const [activeTab, setActiveTab] = useState("machines");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  
  // Filter machines based on search query and filters
  const filteredMachines = MOCK_MACHINES.filter(machine => {
    const matchesSearch = 
      machine.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.client.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "installed" && machine.status === "Instalada") ||
      (statusFilter === "maintenance" && machine.status === "Em Manutenção") ||
      (statusFilter === "stock" && machine.status === "Em Estoque");
      
    const matchesModel = modelFilter === "all" || 
      (modelFilter === "pro" && machine.model === "Terminal Pro") ||
      (modelFilter === "standard" && machine.model === "Terminal Standard") ||
      (modelFilter === "mini" && machine.model === "Terminal Mini");
      
    return matchesSearch && matchesStatus && matchesModel;
  });
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Logística" 
        description="Gestão de máquinas, manutenções e entregas"
      >
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Agendar
        </Button>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="machines" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Máquinas
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Chamados
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Entregas
          </TabsTrigger>
        </TabsList>
        
        {/* Machines Tab */}
        <TabsContent value="machines">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por serial, modelo, cliente..."
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="installed">Instalada</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="stock">Em Estoque</SelectItem>
                </SelectContent>
              </Select>
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Modelos</SelectItem>
                  <SelectItem value="pro">Terminal Pro</SelectItem>
                  <SelectItem value="standard">Terminal Standard</SelectItem>
                  <SelectItem value="mini">Terminal Mini</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
          
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>{machine.serial}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>{machine.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        machine.status === "Instalada" ? "bg-green-50 text-green-700" : 
                        machine.status === "Em Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {machine.status}
                      </span>
                    </TableCell>
                    <TableCell>{machine.lastUpdate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Transferir</Button>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        {/* Support Requests Tab */}
        <TabsContent value="support">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar chamados..."
                className="pl-8 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="inprogress">Em Andamento</SelectItem>
                  <SelectItem value="waiting">Aguardando</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
          
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SUPPORT_REQUESTS.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.client}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.type === "Técnico" ? "bg-green-50 text-green-700" : 
                        request.type === "Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                        request.type === "Software" ? "bg-blue-50 text-blue-700" :
                        request.type === "Hardware" ? "bg-purple-50 text-purple-700" :
                        "bg-gray-50 text-gray-700"
                      }`}>
                        {request.type}
                      </span>
                    </TableCell>
                    <TableCell>{request.description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.status === "Aberto" ? "bg-red-50 text-red-700" : 
                        request.status === "Em Andamento" ? "bg-yellow-50 text-yellow-700" : 
                        request.status === "Aguardando" ? "bg-blue-50 text-blue-700" :
                        request.status === "Resolvido" ? "bg-green-50 text-green-700" :
                        "bg-gray-50 text-gray-700"
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
        
        {/* Deliveries Tab */}
        <TabsContent value="deliveries">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entregas..."
                className="pl-8 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Datas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="tomorrow">Amanhã</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="installation">Instalação</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="collection">Recolhimento</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
          
          <PageWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_DELIVERIES.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.date}</TableCell>
                    <TableCell>{delivery.time}</TableCell>
                    <TableCell>{delivery.client}</TableCell>
                    <TableCell>{delivery.address}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        delivery.type === "Instalação" ? "bg-green-50 text-green-700" : 
                        delivery.type === "Manutenção" ? "bg-yellow-50 text-yellow-700" : 
                        delivery.type === "Entrega" ? "bg-blue-50 text-blue-700" :
                        "bg-purple-50 text-purple-700"
                      }`}>
                        {delivery.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        delivery.status === "Pendente" ? "bg-yellow-50 text-yellow-700" : 
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {delivery.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageWrapper>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <RecentActivities activities={MOCK_ACTIVITIES} />
      </div>
    </div>
  );
};

export default AdminLogistics;
