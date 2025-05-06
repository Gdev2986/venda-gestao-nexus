
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  RefreshCw, 
  Package, 
  Building2,
  Wrench,
  Calendar,
  Clock,
  FilterX,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  TimerReset
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock service requests data
  const serviceRequestsData = [
    {
      id: "SR001",
      type: "maintenance",
      description: "Terminal com falha no leitor de cartão",
      machineId: "CM001",
      model: "POS-X1",
      client: "Restaurante Sabores",
      location: "São Paulo, SP",
      status: "pending",
      priority: "high",
      createdAt: "2025-05-01T10:30:00",
      scheduledFor: "2025-05-03T14:00:00"
    },
    {
      id: "SR002",
      type: "paper",
      description: "Solicita reposição de bobinas (5 unidades)",
      machineId: "CM006",
      model: "POS-X1",
      client: "Restaurante Sabores",
      location: "São Paulo, SP",
      status: "scheduled",
      priority: "medium",
      createdAt: "2025-05-01T11:45:00",
      scheduledFor: "2025-05-04T10:00:00"
    },
    {
      id: "SR003",
      type: "installation",
      description: "Instalação de novo terminal",
      machineId: "N/A",
      model: "POS-X2",
      client: "Padaria Trigo",
      location: "Brasília, DF",
      status: "pending",
      priority: "medium",
      createdAt: "2025-04-30T09:15:00",
      scheduledFor: null
    },
    {
      id: "SR004",
      type: "maintenance",
      description: "Tela com defeito, necessita substituição",
      machineId: "CM003",
      model: "POS-X2",
      client: "Farmácia Saúde",
      location: "Rio de Janeiro, RJ",
      status: "in_progress",
      priority: "high",
      createdAt: "2025-04-29T14:30:00",
      scheduledFor: "2025-05-02T11:00:00"
    },
    {
      id: "SR005",
      type: "paper",
      description: "Solicita reposição de bobinas (10 unidades)",
      machineId: "CM004",
      model: "POS-X3",
      client: "Sorveteria Gelatto",
      location: "Belo Horizonte, MG",
      status: "completed",
      priority: "low",
      createdAt: "2025-04-28T10:00:00",
      scheduledFor: "2025-04-30T13:30:00",
      completedAt: "2025-04-30T14:15:00"
    },
    {
      id: "SR006",
      type: "installation",
      description: "Instalação de terminal adicional",
      machineId: "N/A",
      model: "POS-X3",
      client: "Café Central",
      location: "São Paulo, SP",
      status: "scheduled",
      priority: "high",
      createdAt: "2025-04-29T11:30:00",
      scheduledFor: "2025-05-05T09:30:00"
    },
    {
      id: "SR007",
      type: "maintenance",
      description: "Falha na conexão de internet",
      machineId: "CM008",
      model: "POS-X2",
      client: "Livraria Leitura",
      location: "Salvador, BA",
      status: "completed",
      priority: "medium",
      createdAt: "2025-04-27T15:45:00",
      scheduledFor: "2025-04-29T10:00:00",
      completedAt: "2025-04-29T11:30:00"
    },
    {
      id: "SR008",
      type: "paper",
      description: "Solicita reposição de bobinas (3 unidades)",
      machineId: "CM002",
      model: "POS-X1",
      client: "Café Central",
      location: "São Paulo, SP",
      status: "cancelled",
      priority: "low",
      createdAt: "2025-04-26T09:00:00",
      scheduledFor: "2025-04-28T14:00:00",
      cancelledAt: "2025-04-27T11:30:00"
    }
  ];

  // Filter data based on search term, filters, and active tab
  const filteredRequests = serviceRequestsData.filter(request => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.machineId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    const matchesTab = activeTab === "all" || request.type === activeTab;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTab;
  });

  // Helper for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pendente</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Agendado</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Andamento</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Helper for priority badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Média</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Baixa</Badge>;
      default:
        return <Badge variant="outline">Média</Badge>;
    }
  };

  // Helper for type badges/icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return <Wrench className="h-4 w-4 text-yellow-600" />;
      case "paper":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "installation":
        return <Truck className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Helper for type text
  const getTypeText = (type: string) => {
    switch (type) {
      case "maintenance":
        return "Manutenção";
      case "paper":
        return "Bobinas";
      case "installation":
        return "Instalação";
      default:
        return "Desconhecido";
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados de solicitações foram atualizados com sucesso.",
      });
    }, 1000);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
  };

  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "type",
      header: "Tipo",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.type)}
          <span>{getTypeText(row.original.type)}</span>
        </div>
      ),
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "client",
    },
    {
      id: "machineId",
      header: "ID da Máquina",
      accessorKey: "machineId",
    },
    {
      id: "model",
      header: "Modelo",
      accessorKey: "model",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: { row: { original: any } }) => getStatusBadge(row.original.status),
    },
    {
      id: "priority",
      header: "Prioridade",
      cell: ({ row }: { row: { original: any } }) => getPriorityBadge(row.original.priority),
    },
    {
      id: "createdAt",
      header: "Data da Solicitação",
      cell: ({ row }: { row: { original: any } }) => new Date(row.original.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      id: "scheduledFor",
      header: "Agendado Para",
      cell: ({ row }: { row: { original: any } }) => 
        row.original.scheduledFor 
          ? new Date(row.original.scheduledFor).toLocaleDateString('pt-BR') 
          : "Não agendado",
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast({
            title: "Detalhes",
            description: "Funcionalidade em desenvolvimento",
          })}>
            Detalhes
          </Button>
          {row.original.status === "pending" && (
            <Button variant="outline" size="sm" onClick={() => toast({
              title: "Agendar",
              description: "Funcionalidade em desenvolvimento",
            })}>
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Agendar
            </Button>
          )}
          {(row.original.status === "pending" || row.original.status === "scheduled") && (
            <Button variant="outline" size="sm" className="bg-green-50" onClick={() => toast({
              title: "Iniciar Atendimento",
              description: "Funcionalidade em desenvolvimento",
            })}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
              Iniciar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Solicitações de Serviço" 
        description="Gerenciamento de solicitações de manutenção, bobinas e instalações"
        actionLabel="Nova Solicitação"
        onActionClick={() => toast({
          title: "Nova Solicitação",
          description: "Funcionalidade em desenvolvimento",
        })}
      />
      
      <PageWrapper>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            <TabsTrigger value="paper">Bobinas</TabsTrigger>
            <TabsTrigger value="installation">Instalação</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Filtros</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <FilterX className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição, ID, cliente ou máquina"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-40">
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-40">
                <Select defaultValue={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="paper">Bobinas</SelectItem>
                    <SelectItem value="installation">Instalação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-40">
                <Select defaultValue={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {activeTab === "all" && "Todas as Solicitações"}
                {activeTab === "maintenance" && "Solicitações de Manutenção"}
                {activeTab === "paper" && "Solicitações de Bobinas"}
                {activeTab === "installation" && "Solicitações de Instalação"}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Calendário",
                  description: "Funcionalidade em desenvolvimento",
                })}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Histórico",
                  description: "Funcionalidade em desenvolvimento",
                })}>
                  <Clock className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredRequests}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </PageWrapper>
    </>
  );
};

export default ServiceRequests;
