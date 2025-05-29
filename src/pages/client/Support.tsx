
import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Clock, User, AlertTriangle } from "lucide-react";
import { SupportTicketDialog } from "@/components/support/SupportTicketDialog";
import { SupportChat } from "@/components/support/SupportChat";
import { useSupportSystem } from "@/hooks/use-support-system";
import { formatDate } from "@/utils/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ClientSupport = () => {
  const {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    setSelectedTicket,
    loadMessages,
    createTicket,
    sendMessage
  } = useSupportSystem();

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Suporte"
          description="Gerencie seus chamados de suporte"
        />
        <Button onClick={() => setIsNewTicketOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Você ainda não criou nenhum chamado de suporte.
              </p>
              <Button onClick={() => setIsNewTicketOpen(true)}>
                Criar Primeiro Chamado
              </Button>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTicketClick(ticket)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    {ticket.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTypeLabel(ticket.type)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {ticket.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Criado em {formatDate(ticket.created_at)}
                  </div>
                  {ticket.updated_at && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Atualizado em {formatDate(ticket.updated_at)}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Ticket Dialog */}
      <SupportTicketDialog
        open={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
        onSubmit={createTicket}
        isLoading={isCreating}
      />

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTicket?.title}</span>
              <div className="flex gap-2">
                {selectedTicket && getStatusBadge(selectedTicket.status)}
                {selectedTicket && getPriorityBadge(selectedTicket.priority)}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Tipo:</strong> {getTypeLabel(selectedTicket.type)}</p>
                <p><strong>Criado em:</strong> {formatDate(selectedTicket.created_at)}</p>
                {selectedTicket.description && (
                  <div className="mt-2">
                    <strong>Descrição:</strong>
                    <div className="bg-muted p-3 rounded-md mt-1">
                      {selectedTicket.description}
                    </div>
                  </div>
                )}
              </div>
              
              <SupportChat
                ticketId={selectedTicket.id}
                messages={messages}
                onSendMessage={(message, attachments) => sendMessage(selectedTicket.id, message, attachments)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientSupport;
