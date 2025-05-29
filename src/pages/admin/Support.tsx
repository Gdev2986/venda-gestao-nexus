
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useAdminSupport } from "@/hooks/use-admin-support";
import { AdminSupportTicketCard } from "@/components/admin/support/AdminSupportTicketCard";
import { SupportChatDialog } from "@/components/support/SupportChatDialog";
import { SupportTicket } from "@/types/support.types";
import { supabase } from "@/integrations/supabase/client";

const AdminSupport = () => {
  const { tickets, isLoading, updateTicketStatus, assignTicket, resolveTicket } = useAdminSupport();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [supportAgents, setSupportAgents] = useState<Array<{ id: string; name: string; email: string; }>>([]);

  // Fetch support agents
  useEffect(() => {
    const fetchSupportAgents = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("role", ["ADMIN", "LOGISTICS"])
        .order("name");
      
      setSupportAgents(data || []);
    };

    fetchSupportAgents();
  }, []);

  const handleOpenChat = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsChatDialogOpen(true);
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === "" || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tickets by status
  const pendingTickets = filteredTickets.filter(t => t.status === 'PENDING');
  const inProgressTickets = filteredTickets.filter(t => t.status === 'IN_PROGRESS');
  const completedTickets = filteredTickets.filter(t => t.status === 'COMPLETED');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Suporte Administrativo" 
          description="Gerencie todos os chamados de suporte"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suporte Administrativo" 
        description="Gerencie todos os chamados de suporte"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingTickets.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Em Andamento</span>
            </div>
            <p className="text-2xl font-bold mt-1">{inProgressTickets.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Concluídos</span>
            </div>
            <p className="text-2xl font-bold mt-1">{completedTickets.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Alta Prioridade</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredTickets.filter(t => t.priority === 'HIGH').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="COMPLETED">Concluídos</SelectItem>
                <SelectItem value="CANCELED">Cancelados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
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
          <TabsTrigger value="pending">
            Pendentes ({pendingTickets.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Em Andamento ({inProgressTickets.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídos ({completedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({filteredTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum chamado pendente</p>
                <p className="text-muted-foreground">Todos os chamados estão sendo atendidos</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {pendingTickets.map(ticket => (
                <AdminSupportTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenChat={handleOpenChat}
                  onUpdateStatus={updateTicketStatus}
                  onAssignTicket={assignTicket}
                  onResolveTicket={resolveTicket}
                  supportAgents={supportAgents}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum chamado em andamento</p>
                <p className="text-muted-foreground">Não há chamados sendo processados no momento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {inProgressTickets.map(ticket => (
                <AdminSupportTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenChat={handleOpenChat}
                  onUpdateStatus={updateTicketStatus}
                  onAssignTicket={assignTicket}
                  onResolveTicket={resolveTicket}
                  supportAgents={supportAgents}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum chamado concluído</p>
                <p className="text-muted-foreground">Histórico de chamados concluídos aparecerá aqui</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {completedTickets.map(ticket => (
                <AdminSupportTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenChat={handleOpenChat}
                  onUpdateStatus={updateTicketStatus}
                  onAssignTicket={assignTicket}
                  onResolveTicket={resolveTicket}
                  supportAgents={supportAgents}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum chamado encontrado</p>
                <p className="text-muted-foreground">Ajuste os filtros para ver mais resultados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTickets.map(ticket => (
                <AdminSupportTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenChat={handleOpenChat}
                  onUpdateStatus={updateTicketStatus}
                  onAssignTicket={assignTicket}
                  onResolveTicket={resolveTicket}
                  supportAgents={supportAgents}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <SupportChatDialog
        isOpen={isChatDialogOpen}
        onOpenChange={setIsChatDialogOpen}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default AdminSupport;
