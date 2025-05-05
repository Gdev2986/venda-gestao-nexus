
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Package,
  Truck,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MachineStatus, 
  Machine, 
  SupportRequest, 
  SupportRequestStatus,
  DeliveryStatus,
  Delivery,
  ActivityType
} from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
}

const AdminLogistics = () => {
  const [activeTab, setActiveTab] = useState("machines");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [assignTechDialog, setAssignTechDialog] = useState(false);
  const [technicianName, setTechnicianName] = useState("");
  const [logisticsNote, setLogisticsNote] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for machines
  const machines: Machine[] = [
    {
      id: "MCH-001",
      model: "Payment Terminal X1",
      serial_number: "SN12345678",
      status: MachineStatus.ACTIVE,
      location: "São Paulo - SP",
      client_id: "CLT-001",
      client_name: "Empresa ABC Ltda",
      last_maintenance: "2025-02-15T10:30:00Z",
      installation_date: "2024-05-10T09:00:00Z"
    },
    {
      id: "MCH-002",
      model: "Payment Terminal X2",
      serial_number: "SN98765432",
      status: MachineStatus.MAINTENANCE,
      location: "Rio de Janeiro - RJ",
      client_id: "CLT-002",
      client_name: "Comércio XYZ S/A",
      last_maintenance: "2025-04-01T14:45:00Z",
      installation_date: "2024-06-05T11:15:00Z",
      notes: "Problemas com leitor de cartão"
    },
    {
      id: "MCH-003",
      model: "Payment Terminal X1",
      serial_number: "SN45678901",
      status: MachineStatus.INACTIVE,
      location: "Belo Horizonte - MG",
      client_id: "CLT-003",
      client_name: "Indústria DEF ME",
      last_maintenance: "2025-03-20T08:30:00Z",
      installation_date: "2024-04-12T10:00:00Z",
      deactivated_at: "2025-04-10T16:00:00Z",
      notes: "Cliente solicitou desativação temporária"
    },
    {
      id: "MCH-004",
      model: "Payment Terminal X3",
      serial_number: "SN11223344",
      status: MachineStatus.PENDING_INSTALLATION,
      location: "Brasília - DF",
      client_id: "CLT-004",
      client_name: "Governo GHI Ltda",
      installation_date: "2025-05-20T13:30:00Z"
    }
  ];

  // Mock data for support requests
  const supportRequests: SupportRequest[] = [
    {
      id: "SR-001",
      title: "Terminal não conecta à rede",
      description: "O terminal não está conseguindo se conectar à rede Wi-Fi desde ontem.",
      status: SupportRequestStatus.OPEN,
      priority: "high",
      created_at: "2025-04-28T09:15:00Z",
      client_id: "CLT-001",
      client_name: "Empresa ABC Ltda",
      machine_id: "MCH-001",
      machine_serial: "SN12345678"
    },
    {
      id: "SR-002",
      title: "Leitor de cartão com falha",
      description: "O leitor de cartão está rejeitando transações com cartões de crédito específicos.",
      status: SupportRequestStatus.IN_PROGRESS,
      priority: "medium",
      created_at: "2025-04-25T14:30:00Z",
      updated_at: "2025-04-26T10:00:00Z",
      assigned_to: "Carlos Técnico",
      client_id: "CLT-002",
      client_name: "Comércio XYZ S/A",
      machine_id: "MCH-002",
      machine_serial: "SN98765432"
    },
    {
      id: "SR-003",
      title: "Solicitação de treinamento",
      description: "Precisamos de treinamento adicional para os novos funcionários sobre o uso do terminal.",
      status: SupportRequestStatus.RESOLVED,
      priority: "low",
      created_at: "2025-04-20T11:45:00Z",
      updated_at: "2025-04-24T16:20:00Z",
      resolved_at: "2025-04-24T16:20:00Z",
      assigned_to: "Ana Instrutora",
      resolution: "Treinamento realizado com sucesso para 5 funcionários.",
      client_id: "CLT-003",
      client_name: "Indústria DEF ME",
      machine_id: "MCH-003",
      machine_serial: "SN45678901"
    }
  ];

  // Mock data for deliveries
  const deliveries: Delivery[] = [
    {
      id: "DEL-001",
      machine_id: "MCH-004",
      machine_model: "Payment Terminal X3",
      client_id: "CLT-004",
      client_name: "Governo GHI Ltda",
      delivery_address: "Setor Comercial Sul, Quadra 8, Brasília - DF",
      scheduled_date: "2025-05-15T10:00:00Z",
      status: DeliveryStatus.SCHEDULED,
      notes: "Contatar cliente antes da entrega"
    },
    {
      id: "DEL-002",
      machine_id: "MCH-005",
      machine_model: "Payment Terminal X2",
      client_id: "CLT-005",
      client_name: "Restaurante JKL Ltda",
      delivery_address: "Av. Paulista, 1000, São Paulo - SP",
      scheduled_date: "2025-05-10T14:30:00Z",
      status: DeliveryStatus.IN_TRANSIT,
      transporter: "Express Logística",
      tracking_code: "EXP123456789"
    },
    {
      id: "DEL-003",
      machine_id: "MCH-006",
      machine_model: "Payment Terminal X1",
      client_id: "CLT-006",
      client_name: "Farmácia MNO S/A",
      delivery_address: "Rua da Consolação, 500, São Paulo - SP",
      scheduled_date: "2025-04-28T09:00:00Z",
      actual_delivery_date: "2025-04-28T09:45:00Z",
      status: DeliveryStatus.DELIVERED,
      transporter: "Rápido Entregas",
      tracking_code: "RAP987654321",
      recipient_name: "Maria Gerente",
      notes: "Entrega realizada com sucesso"
    }
  ];

  // Filter machines based on search term and status filter
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = 
      searchTerm === "" || 
      machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      machine.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Filter support requests
  const filteredRequests = supportRequests.filter(request => {
    const matchesSearch = 
      searchTerm === "" || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.machine_serial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      request.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesAssigned = 
      assignedFilter === "all" || 
      (assignedFilter === "assigned" && request.assigned_to) ||
      (assignedFilter === "unassigned" && !request.assigned_to);
    
    return matchesSearch && matchesStatus && matchesAssigned;
  });

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      searchTerm === "" || 
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      delivery.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Handle view machine details
  const handleViewMachine = (machine: Machine) => {
    navigate(PATHS.ADMIN.MACHINE_DETAILS(machine.id));
  };

  // Handle assign technician
  const handleAssignTechnician = () => {
    if (!selectedRequest || !technicianName.trim()) return;
    
    // In a real app, update the database
    toast({
      title: "Técnico designado",
      description: `${technicianName} foi designado para a solicitação ${selectedRequest.id}.`
    });
    
    setAssignTechDialog(false);
    setTechnicianName("");
  };

  // Mock recent activities
  const recentActivities: Activity[] = [
    {
      id: "ACT-001",
      title: "Nova máquina instalada",
      description: "Terminal X3 instalado para Governo GHI Ltda",
      timestamp: "2025-05-01T15:30:00Z",
      type: "machine" as ActivityType
    },
    {
      id: "ACT-002",
      title: "Suporte respondido",
      description: "Solicitação SR-002 atualizada por Carlos Técnico",
      timestamp: "2025-04-26T10:00:00Z",
      type: "support" as ActivityType
    },
    {
      id: "ACT-003",
      title: "Entrega agendada",
      description: "Nova entrega agendada para Restaurante JKL Ltda",
      timestamp: "2025-04-25T09:15:00Z",
      type: "logistics" as ActivityType
    }
  ];

  // Columns for machines table
  const machineColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id"
    },
    {
      id: "model",
      header: "Modelo",
      accessorKey: "model"
    },
    {
      id: "serial_number",
      header: "Número de Série",
      accessorKey: "serial_number"
    },
    {
      id: "client_name",
      header: "Cliente",
      accessorKey: "client_name"
    },
    {
      id: "location",
      header: "Localização",
      accessorKey: "location"
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        let badgeClass = "";
        let statusText = "";
        
        switch (status) {
          case MachineStatus.ACTIVE:
            badgeClass = "bg-green-100 text-green-800";
            statusText = "Ativo";
            break;
          case MachineStatus.MAINTENANCE:
            badgeClass = "bg-yellow-100 text-yellow-800";
            statusText = "Em Manutenção";
            break;
          case MachineStatus.INACTIVE:
            badgeClass = "bg-red-100 text-red-800";
            statusText = "Inativo";
            break;
          case MachineStatus.PENDING_INSTALLATION:
            badgeClass = "bg-blue-100 text-blue-800";
            statusText = "Aguardando Instalação";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            statusText = status;
        }
        
        return (
          <Badge className={badgeClass}>
            {statusText}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info: any) => {
        const machine = info.row.original;
        
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleViewMachine(machine)}
            >
              Detalhes
            </Button>
          </div>
        );
      }
    }
  ];

  // Columns for support requests table
  const supportColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id"
    },
    {
      id: "title",
      header: "Título",
      accessorKey: "title"
    },
    {
      id: "client_name",
      header: "Cliente",
      accessorKey: "client_name"
    },
    {
      id: "machine_serial",
      header: "Máquina",
      accessorKey: "machine_serial"
    },
    {
      id: "priority",
      header: "Prioridade",
      accessorKey: "priority",
      cell: (info: any) => {
        const priority = info.getValue();
        let badgeClass = "";
        let priorityText = "";
        
        switch (priority) {
          case "high":
            badgeClass = "bg-red-100 text-red-800";
            priorityText = "Alta";
            break;
          case "medium":
            badgeClass = "bg-yellow-100 text-yellow-800";
            priorityText = "Média";
            break;
          case "low":
            badgeClass = "bg-blue-100 text-blue-800";
            priorityText = "Baixa";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            priorityText = priority;
        }
        
        return (
          <Badge className={badgeClass}>
            {priorityText}
          </Badge>
        );
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        let badgeClass = "";
        let statusText = "";
        
        switch (status) {
          case SupportRequestStatus.OPEN:
            badgeClass = "bg-blue-100 text-blue-800";
            statusText = "Aberto";
            break;
          case SupportRequestStatus.IN_PROGRESS:
            badgeClass = "bg-yellow-100 text-yellow-800";
            statusText = "Em Andamento";
            break;
          case SupportRequestStatus.RESOLVED:
            badgeClass = "bg-green-100 text-green-800";
            statusText = "Resolvido";
            break;
          case SupportRequestStatus.CLOSED:
            badgeClass = "bg-gray-100 text-gray-800";
            statusText = "Fechado";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            statusText = status;
        }
        
        return (
          <Badge className={badgeClass}>
            {statusText}
          </Badge>
        );
      }
    },
    {
      id: "assigned_to",
      header: "Responsável",
      accessorKey: "assigned_to",
      cell: (info: any) => {
        const assignedTo = info.getValue();
        
        return assignedTo ? assignedTo : "Não atribuído";
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info: any) => {
        const request = info.row.original;
        
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedRequest(request)}
            >
              Detalhes
            </Button>
            {request.status === SupportRequestStatus.OPEN && !request.assigned_to && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRequest(request);
                  setAssignTechDialog(true);
                }}
              >
                Atribuir
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  // Columns for deliveries table
  const deliveryColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id"
    },
    {
      id: "client_name",
      header: "Cliente",
      accessorKey: "client_name"
    },
    {
      id: "machine_model",
      header: "Modelo",
      accessorKey: "machine_model"
    },
    {
      id: "scheduled_date",
      header: "Data Agendada",
      accessorKey: "scheduled_date",
      cell: (info: any) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        let badgeClass = "";
        let statusText = "";
        
        switch (status) {
          case DeliveryStatus.SCHEDULED:
            badgeClass = "bg-blue-100 text-blue-800";
            statusText = "Agendada";
            break;
          case DeliveryStatus.IN_TRANSIT:
            badgeClass = "bg-yellow-100 text-yellow-800";
            statusText = "Em Trânsito";
            break;
          case DeliveryStatus.DELIVERED:
            badgeClass = "bg-green-100 text-green-800";
            statusText = "Entregue";
            break;
          case DeliveryStatus.CANCELED:
            badgeClass = "bg-red-100 text-red-800";
            statusText = "Cancelada";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
            statusText = status;
        }
        
        return (
          <Badge className={badgeClass}>
            {statusText}
          </Badge>
        );
      }
    },
    {
      id: "tracking_code",
      header: "Rastreamento",
      accessorKey: "tracking_code",
      cell: (info: any) => {
        const trackingCode = info.getValue();
        
        return trackingCode ? trackingCode : "N/A";
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info: any) => {
        const delivery = info.row.original;
        
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Detalhes da Entrega",
                  description: `Visualizando detalhes da entrega ${delivery.id}`
                });
              }}
            >
              Detalhes
            </Button>
            {delivery.status === DeliveryStatus.SCHEDULED && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Atualizar Status",
                    description: `Atualizando status da entrega ${delivery.id}`
                  });
                }}
              >
                Atualizar
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Logística" 
        description="Gerenciar máquinas, solicitações de suporte e entregas"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Máquinas
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machines.length}</div>
            <p className="text-xs text-muted-foreground">
              {machines.filter(m => m.status === MachineStatus.ACTIVE).length} ativas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitações de Suporte
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {supportRequests.filter(s => s.status === SupportRequestStatus.OPEN).length} em aberto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entregas Agendadas
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              {deliveries.filter(d => d.status === DeliveryStatus.SCHEDULED).length} pendentes
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Visão Geral de Logística</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="machines">
                <Package className="h-4 w-4 mr-2" />
                Máquinas
              </TabsTrigger>
              <TabsTrigger value="support">
                <AlertCircle className="h-4 w-4 mr-2" />
                Suporte
              </TabsTrigger>
              <TabsTrigger value="deliveries">
                <Truck className="h-4 w-4 mr-2" />
                Entregas
              </TabsTrigger>
            </TabsList>
            
            {/* Machines Tab */}
            <TabsContent value="machines" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar máquinas..."
                      className="pl-8 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="maintenance">Em Manutenção</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="pending_installation">Aguardando Instalação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button asChild className="w-full md:w-auto">
                  <a href={PATHS.ADMIN.MACHINE_NEW}>Adicionar Máquina</a>
                </Button>
              </div>
              
              <DataTable
                columns={machineColumns}
                data={filteredMachines}
              />
            </TabsContent>
            
            {/* Support Tab */}
            <TabsContent value="support" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar solicitações..."
                      className="pl-8 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="open">Em Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="resolved">Resolvidos</SelectItem>
                      <SelectItem value="closed">Fechados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por atribuição" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas solicitações</SelectItem>
                      <SelectItem value="assigned">Atribuídas</SelectItem>
                      <SelectItem value="unassigned">Não atribuídas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DataTable
                columns={supportColumns}
                data={filteredRequests}
              />
            </TabsContent>
            
            {/* Deliveries Tab */}
            <TabsContent value="deliveries" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar entregas..."
                      className="pl-8 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="scheduled">Agendadas</SelectItem>
                      <SelectItem value="in_transit">Em Trânsito</SelectItem>
                      <SelectItem value="delivered">Entregues</SelectItem>
                      <SelectItem value="canceled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Agendar Entrega",
                    description: "Função a ser implementada."
                  });
                }}>
                  Agendar Entrega
                </Button>
              </div>
              
              <DataTable
                columns={deliveryColumns}
                data={filteredDeliveries}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximas Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries
                .filter(d => d.status === DeliveryStatus.SCHEDULED)
                .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
                .slice(0, 3)
                .map((delivery) => {
                  const date = new Date(delivery.scheduled_date);
                  return (
                    <div key={delivery.id} className="flex items-center p-3 border rounded-lg">
                      <div className="mr-4 bg-primary/10 p-2 rounded-full">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{delivery.client_name}</h4>
                        <p className="text-sm text-muted-foreground">{delivery.delivery_address}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">
                          {date.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 border rounded-lg">
                  <div className="mr-3 mt-0.5">
                    {activity.type === "machine" && (
                      <Package className="h-4 w-4 text-blue-500" />
                    )}
                    {activity.type === "support" && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    {activity.type === "logistics" && (
                      <Truck className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Request details dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação #{selectedRequest.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Título</h4>
                <p>{selectedRequest.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Descrição</h4>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Cliente</h4>
                  <p className="text-sm">{selectedRequest.client_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Máquina</h4>
                  <p className="text-sm">{selectedRequest.machine_serial}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Prioridade</h4>
                  <Badge className={
                    selectedRequest.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : selectedRequest.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }>
                    {selectedRequest.priority === "high"
                      ? "Alta"
                      : selectedRequest.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <Badge className={
                    selectedRequest.status === SupportRequestStatus.OPEN
                      ? "bg-blue-100 text-blue-800"
                      : selectedRequest.status === SupportRequestStatus.IN_PROGRESS
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }>
                    {selectedRequest.status === SupportRequestStatus.OPEN
                      ? "Aberto"
                      : selectedRequest.status === SupportRequestStatus.IN_PROGRESS
                      ? "Em Andamento"
                      : "Resolvido"}
                  </Badge>
                </div>
              </div>
              
              {selectedRequest.status !== SupportRequestStatus.RESOLVED && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Responder</h4>
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              )}
              
              {selectedRequest.resolution && (
                <div>
                  <h4 className="text-sm font-medium">Resolução</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequest.resolution}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedRequest.status !== SupportRequestStatus.RESOLVED && (
                <Button
                  variant="default"
                  onClick={() => {
                    toast({
                      title: "Resposta enviada",
                      description: "Sua resposta foi enviada com sucesso."
                    });
                    setSelectedRequest(null);
                    setResponseText("");
                  }}
                  disabled={!responseText.trim()}
                >
                  Enviar Resposta
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null);
                  setResponseText("");
                }}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Assign technician dialog */}
      <Dialog open={assignTechDialog} onOpenChange={setAssignTechDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atribuir Técnico</DialogTitle>
            <DialogDescription>
              Atribuir técnico para a solicitação {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Nome do Técnico</Label>
              <Input
                id="technician"
                placeholder="Digite o nome do técnico..."
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notify" />
              <Label htmlFor="notify">Notificar técnico por e-mail</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="priority" />
              <Label htmlFor="priority">Marcar como alta prioridade</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTechDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignTechnician} disabled={!technicianName.trim()}>
              Atribuir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogistics;
