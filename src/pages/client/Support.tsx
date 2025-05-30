import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { SupportTicketDialog } from "@/components/support/SupportTicketDialog";
import { SupportChat } from "@/components/support/SupportChat";
import { TicketStatusManager } from "@/components/support/TicketStatusManager";
import { useSupportSystem } from "@/hooks/use-support-system";
import { formatDate } from "@/utils/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ClientSupport = () => {
  const {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    clientId,
    setSelectedTicket,
    loadMessages,
    createTicket,
    sendMessage,
    updateTicketStatus,
    assignTicket
  } = useSupportSystem();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);

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
      case "REPAIR": return "Reparo";
      case "TRAINING": return "Treinamento";
      case "SUPPORT": return "Suporte";
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
    setShowChatDialog(true);
  };

  const handleCloseChat = () => {
    setShowChatDialog(false);
    setSelectedTicket(null);
  };

  // Statistics
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "PENDING").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    completed: tickets.filter(t => t.status === "COMPLETED").length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Suporte"
          description="Gerencie seus chamados de suporte"
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
        title="Suporte"
        description="Gerencie seus chamados de suporte"
        action={
          <Button 
            onClick={() => setShowCreateDialog(true)}
            disabled={!clientId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Chamado
          </Button>
        }
      />

      {/* Show warning if no client association */}
      {!clientId && (
        <Card>
          <CardContent className="p-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você não está associado a um cliente. Entre em contato com o administrador para criar chamados de suporte.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <AlertTriangle className="h-8 w-8 text-blue-500" />
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
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não criou nenhum chamado de suporte.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} disabled={!clientId}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Chamado
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => handleTicketClick(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Chamado #{ticket.id.substring(0, 8)}</span>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {getTypeLabel(ticket.type)}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.description.substring(0, 100)}
                          {ticket.description.length > 100 && "..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Criado em {formatDate(ticket.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <SupportTicketDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={createTicket}
        isLoading={isCreating}
        clientId={clientId}
      />

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={handleCloseChat}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[800px] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="p-3 sm:p-4 lg:p-6 pb-2 flex-shrink-0">
            <DialogTitle className="flex items-center justify-between text-sm sm:text-base lg:text-lg">
              <span className="truncate mr-2">Chamado #{selectedTicket?.id.substring(0, 8)}</span>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {selectedTicket && getPriorityBadge(selectedTicket.priority)}
                {selectedTicket && getStatusBadge(selectedTicket.status)}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="flex-1 overflow-hidden">
              {/* Mobile Layout */}
              <div className="block lg:hidden h-full flex flex-col p-3 sm:p-4 space-y-3">
                <div className="flex-shrink-0 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <p><strong>Tipo:</strong> {getTypeLabel(selectedTicket.type)}</p>
                      <p><strong>Prioridade:</strong> {selectedTicket.priority}</p>
                    </div>
                    <div>
                      <p><strong>Criado:</strong> {formatDate(selectedTicket.created_at)}</p>
                      {selectedTicket.updated_at && (
                        <p><strong>Atualizado:</strong> {formatDate(selectedTicket.updated_at)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-xs sm:text-sm">Descrição:</strong>
                    <div className="bg-muted p-2 rounded-md mt-1 text-xs sm:text-sm max-h-16 overflow-y-auto">
                      {selectedTicket.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0 w-full">
                  <SupportChat
                    ticketId={selectedTicket.id}
                    messages={messages}
                    onSendMessage={(message) => sendMessage(selectedTicket.id, message)}
                  />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block h-full">
                <div className="grid grid-cols-3 gap-6 p-6 h-full">
                  {/* Chat Section */}
                  <div className="col-span-2 flex flex-col min-h-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
                      <div>
                        <p><strong>Tipo:</strong> {getTypeLabel(selectedTicket.type)}</p>
                        <p><strong>Prioridade:</strong> {selectedTicket.priority}</p>
                      </div>
                      <div>
                        <p><strong>Criado em:</strong> {formatDate(selectedTicket.created_at)}</p>
                        {selectedTicket.updated_at && (
                          <p><strong>Atualizado em:</strong> {formatDate(selectedTicket.updated_at)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <strong>Descrição:</strong>
                      <div className="bg-muted p-3 rounded-md mt-1 text-sm max-h-20 overflow-y-auto">
                        {selectedTicket.description}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-h-0">
                      <SupportChat
                        ticketId={selectedTicket.id}
                        messages={messages}
                        onSendMessage={(message) => sendMessage(selectedTicket.id, message)}
                      />
                    </div>
                  </div>

                  {/* Status Management Section */}
                  <div className="space-y-4 overflow-y-auto">
                    <TicketStatusManager
                      ticket={selectedTicket}
                      onStatusChange={updateTicketStatus}
                      onAssignTicket={assignTicket}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientSupport;
