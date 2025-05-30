
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Search, User, UserCheck } from "lucide-react";
import { SupportChat } from "@/components/support/SupportChat";
import { useSupportSystem } from "@/hooks/use-support-system";
import { formatDate } from "@/utils/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const AdminSupport = () => {
  const {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    setSelectedTicket,
    loadMessages,
    sendMessage,
    updateTicketStatus,
    assignTicket
  } = useSupportSystem();

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);

  // Load technicians
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('role', ['ADMIN', 'LOGISTICS']);

        if (error) throw error;
        setTechnicians(data || []);
      } catch (error) {
        console.error('Error loading technicians:', error);
      }
    };

    loadTechnicians();
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Pendente</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Em Andamento</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Concluído</Badge>;
      case "CANCELED":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="destructive">Alta</Badge>;
      case "MEDIUM":
        return <Badge variant="secondary">Média</Badge>;
      case "LOW":
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MAINTENANCE": return "Manutenção";
      case "INSTALLATION": return "Instalação";
      case "REPLACEMENT": return "Substituição";
      case "SUPPLIES": return "Materiais";
      case "REMOVAL": return "Remoção";
      case "OTHER": return "Outro";
      default: return type;
    }
  };

  const handleTicketClick = async (ticket: any) => {
    setSelectedTicket(ticket);
    await loadMessages(ticket.id);
    setIsChatOpen(true);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    await updateTicketStatus(ticketId, newStatus);
  };

  const handleAssignTicket = async (ticketId: string) => {
    if (user?.id) {
      await assignTicket(ticketId, user.id);
    }
  };

  // Statistics
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "PENDING").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    completed: tickets.filter(t => t.status === "COMPLETED").length,
    highPriority: tickets.filter(t => t.priority === "HIGH").length,
    assigned: tickets.filter(t => t.technician_id).length
  };

  const getTicketsByStatus = (status: string) => {
    return filteredTickets.filter(ticket => ticket.status === status);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Suporte - Admin"
          description="Gerencie todos os chamados de suporte"
        />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suporte - Admin"
        description="Gerencie todos os chamados de suporte"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atribuídos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.assigned}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar chamados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="LOW">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pendentes ({getTicketsByStatus("PENDING").length})</TabsTrigger>
          <TabsTrigger value="in_progress">Em Andamento ({getTicketsByStatus("IN_PROGRESS").length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({getTicketsByStatus("COMPLETED").length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({filteredTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <TicketsList 
            tickets={getTicketsByStatus("PENDING")} 
            onTicketClick={handleTicketClick}
            onStatusChange={handleStatusChange}
            onAssignTicket={handleAssignTicket}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            getTypeLabel={getTypeLabel}
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="in_progress">
          <TicketsList 
            tickets={getTicketsByStatus("IN_PROGRESS")} 
            onTicketClick={handleTicketClick}
            onStatusChange={handleStatusChange}
            onAssignTicket={handleAssignTicket}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            getTypeLabel={getTypeLabel}
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TicketsList 
            tickets={getTicketsByStatus("COMPLETED")} 
            onTicketClick={handleTicketClick}
            onStatusChange={handleStatusChange}
            onAssignTicket={handleAssignTicket}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            getTypeLabel={getTypeLabel}
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="all">
          <TicketsList 
            tickets={filteredTickets} 
            onTicketClick={handleTicketClick}
            onStatusChange={handleStatusChange}
            onAssignTicket={handleAssignTicket}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            getTypeLabel={getTypeLabel}
            currentUserId={user?.id}
          />
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Chamado de Suporte</span>
              <div className="flex gap-2">
                {selectedTicket && (
                  <Select 
                    value={selectedTicket.status} 
                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                      <SelectItem value="CANCELED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {selectedTicket && getPriorityBadge(selectedTicket.priority)}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Cliente:</strong> {selectedTicket.client?.business_name}</p>
                  <p><strong>Tipo:</strong> {getTypeLabel(selectedTicket.type)}</p>
                  {selectedTicket.technician_id && (
                    <p><strong>Técnico:</strong> {technicians.find(t => t.id === selectedTicket.technician_id)?.name || 'Atribuído'}</p>
                  )}
                </div>
                <div>
                  <p><strong>Criado em:</strong> {formatDate(selectedTicket.created_at)}</p>
                  {selectedTicket.updated_at && (
                    <p><strong>Atualizado em:</strong> {formatDate(selectedTicket.updated_at)}</p>
                  )}
                </div>
              </div>
              
              {selectedTicket.description && (
                <div>
                  <strong>Descrição:</strong>
                  <div className="bg-muted p-3 rounded-md mt-1">
                    {selectedTicket.description}
                  </div>
                </div>
              )}
              
              <SupportChat
                ticketId={selectedTicket.id}
                messages={messages}
                onSendMessage={(message) => sendMessage(selectedTicket.id, message)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component for rendering tickets list
const TicketsList = ({ 
  tickets, 
  onTicketClick, 
  onStatusChange, 
  onAssignTicket,
  getStatusBadge, 
  getPriorityBadge, 
  getTypeLabel,
  currentUserId
}: any) => {
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
          <p className="text-muted-foreground text-center">
            Não há chamados nesta categoria no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket: any) => (
        <Card key={ticket.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Suporte - {ticket.client?.business_name}
              </CardTitle>
              <div className="flex gap-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{ticket.client?.business_name}</span> • {getTypeLabel(ticket.type)}
              {ticket.technician_id && (
                <span> • Atribuído</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {ticket.description}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Criado em {formatDate(ticket.created_at)}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onTicketClick(ticket)}
                >
                  Ver Detalhes
                </Button>
                {ticket.status === "PENDING" && !ticket.technician_id && (
                  <Button 
                    size="sm"
                    onClick={() => onAssignTicket(ticket.id)}
                  >
                    Atender
                  </Button>
                )}
                {ticket.status === "PENDING" && ticket.technician_id === currentUserId && (
                  <Button 
                    size="sm"
                    onClick={() => onStatusChange(ticket.id, "IN_PROGRESS")}
                  >
                    Iniciar
                  </Button>
                )}
                {ticket.status === "IN_PROGRESS" && ticket.technician_id === currentUserId && (
                  <Button 
                    size="sm"
                    onClick={() => onStatusChange(ticket.id, "COMPLETED")}
                  >
                    Concluir
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminSupport;
