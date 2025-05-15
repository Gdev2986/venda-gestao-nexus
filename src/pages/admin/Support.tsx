import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Upload,
  User,
  Users
} from "lucide-react";

// Define types
interface SupportTicket {
  id: string;
  client_name: string;
  client_id: string;
  department: "FINANCIAL" | "TECHNICAL" | "LOGISTICS" | "SALES" | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_CLIENT" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  created_at: string;
  updated_at: string;
  last_response_at: string | null;
  assigned_to: string | null;
  user_type: "CLIENT" | "PARTNER";
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  message: string;
  created_at: string;
  sender_id: string;
  sender_name: string;
  sender_type: "ADMIN" | "CLIENT" | "PARTNER" | "SYSTEM";
  attachments: TicketAttachment[];
}

interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  content_type: string;
}

interface TicketLog {
  id: string;
  ticket_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  details: string;
}

const AdminSupport = () => {
  const { toast } = useToast();

  // State for tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TK-1001",
      client_name: "Empresa ABC Ltda",
      client_id: "c-101",
      department: "FINANCIAL",
      status: "OPEN",
      priority: "HIGH",
      subject: "Erro no pagamento PIX",
      created_at: "2025-05-05T14:30:00Z",
      updated_at: "2025-05-05T14:30:00Z",
      last_response_at: null,
      assigned_to: null,
      user_type: "CLIENT"
    },
    {
      id: "TK-1002",
      client_name: "Distribuidora XYZ",
      client_id: "c-102",
      department: "TECHNICAL",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      subject: "Maquininha não conecta à internet",
      created_at: "2025-05-04T10:15:00Z",
      updated_at: "2025-05-05T09:20:00Z",
      last_response_at: "2025-05-05T09:20:00Z",
      assigned_to: "Admin1",
      user_type: "CLIENT"
    },
    {
      id: "TK-1003",
      client_name: "Parceiro DEF",
      client_id: "p-103",
      department: "SALES",
      status: "WAITING_CLIENT",
      priority: "LOW",
      subject: "Dúvida sobre comissões",
      created_at: "2025-05-03T16:45:00Z",
      updated_at: "2025-05-04T11:30:00Z",
      last_response_at: "2025-05-04T11:30:00Z",
      assigned_to: "Admin2",
      user_type: "PARTNER"
    },
    {
      id: "TK-1004",
      client_name: "Loja GHI",
      client_id: "c-104",
      department: "LOGISTICS",
      status: "OPEN",
      priority: "URGENT",
      subject: "Solicitação urgente de nova máquina",
      created_at: "2025-05-05T08:00:00Z",
      updated_at: "2025-05-05T08:00:00Z",
      last_response_at: null,
      assigned_to: null,
      user_type: "CLIENT"
    },
    {
      id: "TK-1005",
      client_name: "Supermercado JKL",
      client_id: "c-105",
      department: "TECHNICAL",
      status: "RESOLVED",
      priority: "HIGH",
      subject: "Erro na impressão de recibos",
      created_at: "2025-05-02T13:20:00Z",
      updated_at: "2025-05-04T15:10:00Z",
      last_response_at: "2025-05-04T15:10:00Z",
      assigned_to: "Admin3",
      user_type: "CLIENT"
    }
  ]);

  // State for tickets filter
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: Date | null, to: Date | null}>({
    from: null, 
    to: null
  });
  
  // State for ticket details
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [ticketLogs, setTicketLogs] = useState<TicketLog[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showTicketDetails, setShowTicketDetails] = useState<boolean>(false);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);

  // State for response tab
  const [activeTab, setActiveTab] = useState<string>("messages");

  // Function to filter tickets
  const filteredTickets = tickets.filter(ticket => {
    // Status filter
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false;
    }
    
    // Department filter
    if (departmentFilter !== "all" && ticket.department !== departmentFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
      return false;
    }
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.client_name.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Function to handle ticket selection
  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsLoadingMessages(true);
    
    // Simulate loading messages for the selected ticket
    setTimeout(() => {
      setTicketMessages([
        {
          id: "msg-1",
          ticket_id: ticket.id,
          message: "Olá, estou enfrentando problemas com o sistema de pagamento. O PIX não está sendo processado corretamente.",
          created_at: ticket.created_at,
          sender_id: ticket.client_id,
          sender_name: ticket.client_name,
          sender_type: "CLIENT",
          attachments: []
        },
        {
          id: "msg-2",
          ticket_id: ticket.id,
          message: "Ticket recebido e encaminhado para o setor financeiro.",
          created_at: new Date(new Date(ticket.created_at).getTime() + 10 * 60000).toISOString(),
          sender_id: "system",
          sender_name: "Sistema",
          sender_type: "SYSTEM",
          attachments: []
        }
      ]);
      
      setTicketLogs([
        {
          id: "log-1",
          ticket_id: ticket.id,
          action: "Ticket criado",
          performed_by: ticket.client_name,
          performed_at: ticket.created_at,
          details: "Cliente enviou nova solicitação"
        },
        {
          id: "log-2",
          ticket_id: ticket.id,
          action: "Encaminhado para FINANCIAL",
          performed_by: "Sistema",
          performed_at: new Date(new Date(ticket.created_at).getTime() + 5 * 60000).toISOString(),
          details: "Ticket encaminhado automaticamente"
        }
      ]);
      
      setIsLoadingMessages(false);
      setShowTicketDetails(true);
    }, 1000);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "OPEN":
        return <Badge className="bg-blue-500">Aberto</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-yellow-500">Em Andamento</Badge>;
      case "WAITING_CLIENT":
        return <Badge className="bg-purple-500">Aguardando Cliente</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-500">Resolvido</Badge>;
      case "CLOSED":
        return <Badge className="bg-gray-500">Fechado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "LOW":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Baixa</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Média</Badge>;
      case "HIGH":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Alta</Badge>;
      case "URGENT":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Function to get department label
  const getDepartmentLabel = (department: string) => {
    switch(department) {
      case "FINANCIAL": return "Financeiro";
      case "TECHNICAL": return "Técnico";
      case "LOGISTICS": return "Logística";
      case "SALES": return "Vendas";
      case "OTHER": return "Outro";
      default: return department;
    }
  };

  // Function to send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    setIsLoadingAction(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        ticket_id: selectedTicket.id,
        message: newMessage,
        created_at: new Date().toISOString(),
        sender_id: "admin-1",
        sender_name: "Administrador",
        sender_type: "ADMIN",
        attachments: []
      };
      
      setTicketMessages([...ticketMessages, newMsg]);
      
      // Add log
      const newLog: TicketLog = {
        id: `log-${Date.now()}`,
        ticket_id: selectedTicket.id,
        action: "Resposta enviada",
        performed_by: "Administrador",
        performed_at: new Date().toISOString(),
        details: "Administrador respondeu ao ticket"
      };
      
      setTicketLogs([...ticketLogs, newLog]);
      
      // Update ticket
      const updatedTickets = tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            status: "IN_PROGRESS" as const,
            updated_at: new Date().toISOString(),
            last_response_at: new Date().toISOString(),
            assigned_to: "Admin1"
          };
        }
        return t;
      });
      
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        status: "IN_PROGRESS",
        updated_at: new Date().toISOString(),
        last_response_at: new Date().toISOString(),
        assigned_to: "Admin1"
      });
      
      setNewMessage("");
      setIsLoadingAction(false);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
    }, 1000);
  };

  // Function to change ticket status
  const handleChangeStatus = (newStatus: string) => {
    if (!selectedTicket) return;
    
    setIsLoadingAction(true);
    
    // Simulate status change
    setTimeout(() => {
      // Update ticket
      const updatedTickets = tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            status: newStatus as any,
            updated_at: new Date().toISOString()
          };
        }
        return t;
      });
      
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus as any,
        updated_at: new Date().toISOString()
      });
      
      // Add log
      const newLog: TicketLog = {
        id: `log-${Date.now()}`,
        ticket_id: selectedTicket.id,
        action: `Status alterado para ${newStatus}`,
        performed_by: "Administrador",
        performed_at: new Date().toISOString(),
        details: `Administrador alterou o status do ticket para ${newStatus}`
      };
      
      setTicketLogs([...ticketLogs, newLog]);
      
      setIsLoadingAction(false);
      
      toast({
        title: "Status alterado",
        description: `O status do ticket foi alterado para ${newStatus}.`,
      });
    }, 1000);
  };

  // Function to change ticket department
  const handleChangeDepartment = (newDepartment: string) => {
    if (!selectedTicket) return;
    
    setIsLoadingAction(true);
    
    // Simulate department change
    setTimeout(() => {
      // Update ticket
      const updatedTickets = tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            department: newDepartment as any,
            updated_at: new Date().toISOString()
          };
        }
        return t;
      });
      
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        department: newDepartment as any,
        updated_at: new Date().toISOString()
      });
      
      // Add log
      const newLog: TicketLog = {
        id: `log-${Date.now()}`,
        ticket_id: selectedTicket.id,
        action: `Encaminhado para ${getDepartmentLabel(newDepartment)}`,
        performed_by: "Administrador",
        performed_at: new Date().toISOString(),
        details: `Administrador encaminhou o ticket para o setor de ${getDepartmentLabel(newDepartment)}`
      };
      
      setTicketLogs([...ticketLogs, newLog]);
      
      setIsLoadingAction(false);
      
      toast({
        title: "Ticket encaminhado",
        description: `O ticket foi encaminhado para o setor de ${getDepartmentLabel(newDepartment)}.`,
      });
    }, 1000);
  };

  // Function to change ticket priority
  const handleChangePriority = (newPriority: string) => {
    if (!selectedTicket) return;
    
    setIsLoadingAction(true);
    
    // Simulate priority change
    setTimeout(() => {
      // Update ticket
      const updatedTickets = tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            priority: newPriority as any,
            updated_at: new Date().toISOString()
          };
        }
        return t;
      });
      
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        priority: newPriority as any,
        updated_at: new Date().toISOString()
      });
      
      // Add log
      const newLog: TicketLog = {
        id: `log-${Date.now()}`,
        ticket_id: selectedTicket.id,
        action: `Prioridade alterada para ${newPriority}`,
        performed_by: "Administrador",
        performed_at: new Date().toISOString(),
        details: `Administrador alterou a prioridade do ticket para ${newPriority}`
      };
      
      setTicketLogs([...ticketLogs, newLog]);
      
      setIsLoadingAction(false);
      
      toast({
        title: "Prioridade alterada",
        description: `A prioridade do ticket foi alterada para ${newPriority}.`,
      });
    }, 1000);
  };

  // Define columns for the data table
  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{ticket.client_name}</span>
            <span className="text-xs text-muted-foreground">
              {ticket.user_type === "CLIENT" ? "Cliente" : "Parceiro"}
            </span>
          </div>
        );
      },
    },
    {
      id: "department",
      header: "Setor",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return <span>{getDepartmentLabel(ticket.department)}</span>;
      },
    },
    {
      id: "subject",
      header: "Assunto",
      accessorKey: "subject",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return getStatusBadge(ticket.status);
      },
    },
    {
      id: "priority",
      header: "Prioridade",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return getPriorityBadge(ticket.priority);
      },
    },
    {
      id: "created_at",
      header: "Data",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return <span>{formatDate(ticket.created_at)}</span>;
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: any) => {
        const ticket = row.original;
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleSelectTicket(ticket)}>
              Detalhes
            </Button>
          </div>
        );
      },
    },
  ];

  // Main statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const urgentTickets = tickets.filter(t => t.priority === "URGENT").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central de Suporte"
        description="Gerencie solicitações de suporte de clientes e parceiros"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, cliente ou assunto..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="OPEN">Aberto</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="WAITING_CLIENT">Aguardando Cliente</SelectItem>
                  <SelectItem value="RESOLVED">Resolvido</SelectItem>
                  <SelectItem value="CLOSED">Fechado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Setores</SelectItem>
                  <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                  <SelectItem value="TECHNICAL">Técnico</SelectItem>
                  <SelectItem value="LOGISTICS">Logística</SelectItem>
                  <SelectItem value="SALES">Vendas</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={priorityFilter} 
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Período</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <PageWrapper>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <DataTable
            columns={columns}
            data={filteredTickets}
            isLoading={false}
          />
        </div>
      </PageWrapper>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetails} onOpenChange={setShowTicketDetails}>
        <DialogContent className="max-w-3xl">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Ticket #{selectedTicket.id}</span>
                  <div className="flex space-x-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  {selectedTicket.subject}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="ml-2 font-medium">{selectedTicket.client_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="ml-2">{selectedTicket.user_type === "CLIENT" ? "Cliente" : "Parceiro"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Setor:</span>
                  <span className="ml-2">{getDepartmentLabel(selectedTicket.department)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Criado em:</span>
                  <span className="ml-2">{formatDate(selectedTicket.created_at)}</span>
                </div>
              </div>

              <div className="py-2 flex flex-wrap gap-2">
                <Select onValueChange={handleChangeStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Alterar Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Aberto</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                    <SelectItem value="WAITING_CLIENT">Aguardando Cliente</SelectItem>
                    <SelectItem value="RESOLVED">Resolvido</SelectItem>
                    <SelectItem value="CLOSED">Fechado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select onValueChange={handleChangeDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Encaminhar para" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                    <SelectItem value="TECHNICAL">Técnico</SelectItem>
                    <SelectItem value="LOGISTICS">Logística</SelectItem>
                    <SelectItem value="SALES">Vendas</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select onValueChange={handleChangePriority}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Alterar Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogsModal(true)}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-4 w-4" /> Histórico
                </Button>
              </div>

              <Tabs 
                defaultValue="messages" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mt-2"
              >
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="messages" className="flex-1">Mensagens</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="messages">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <div className="space-y-4 max-h-72 overflow-y-auto mb-4 p-2">
                        {ticketMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${
                              message.sender_type === "ADMIN" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div 
                              className={`rounded-lg p-3 max-w-[80%] ${
                                message.sender_type === "ADMIN" 
                                  ? "bg-primary text-primary-foreground" 
                                  : message.sender_type === "SYSTEM"
                                    ? "bg-muted text-muted-foreground text-xs italic"
                                    : "bg-muted"
                              }`}
                            >
                              <div className="mb-1 text-xs flex justify-between gap-4">
                                <span className="font-medium">{message.sender_name}</span>
                                <span>{formatDate(message.created_at)}</span>
                              </div>
                              <p className="whitespace-pre-wrap">{message.message}</p>
                              
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment) => (
                                    <div key={attachment.id} className="text-xs flex items-center">
                                      <a 
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline flex items-center"
                                      >
                                        <span>{attachment.filename}</span>
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Reply Form */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Digite sua resposta..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-between">
                          <Button variant="outline" className="flex items-center gap-1">
                            <Upload className="h-4 w-4" /> Anexar
                          </Button>
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={!newMessage.trim() || isLoadingAction}
                            className="flex items-center gap-1"
                          >
                            {isLoadingAction ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" /> Enviar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Detalhes do Cliente</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">ID: </span>
                            <span>{selectedTicket.client_id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Nome: </span>
                            <span>{selectedTicket.client_name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo: </span>
                            <span>{selectedTicket.user_type === "CLIENT" ? "Cliente" : "Parceiro"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Atividade Recente</h3>
                      <div className="space-y-2">
                        {ticketLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="p-2 bg-muted rounded-md">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">{log.action}</span>
                              <span>{formatDate(log.performed_at)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {log.performed_by} - {log.details}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTicketDetails(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Logs Modal */}
      <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Histórico de Atividades</DialogTitle>
            <DialogDescription>
              Histórico completo de atividades deste ticket
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ticketLogs.map((log) => (
              <div key={log.id} className="p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs">{formatDate(log.performed_at)}</span>
                </div>
                <div className="text-sm flex items-center gap-1 mt-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{log.performed_by}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {log.details}
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogsModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;
