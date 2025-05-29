
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  X,
  Settings
} from "lucide-react";
import { SupportTicket, SupportRequestStatus } from "@/types/support.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminSupportTicketCardProps {
  ticket: SupportTicket;
  onOpenChat: (ticket: SupportTicket) => void;
  onUpdateStatus: (ticketId: string, status: SupportRequestStatus) => Promise<boolean>;
  onAssignTicket: (ticketId: string, assignedTo: string) => Promise<boolean>;
  onResolveTicket: (ticketId: string, resolution: string) => Promise<boolean>;
  supportAgents: Array<{ id: string; name: string; email: string; }>;
}

export const AdminSupportTicketCard: React.FC<AdminSupportTicketCardProps> = ({
  ticket,
  onOpenChat,
  onUpdateStatus,
  onAssignTicket,
  onResolveTicket,
  supportAgents
}) => {
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS': return <MessageCircle className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELED': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELED': return 'Cancelado';
      default: return status;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'LOW': return <AlertTriangle className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Alta';
      case 'MEDIUM': return 'Média';
      case 'LOW': return 'Baixa';
      default: return priority;
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    
    setIsSubmitting(true);
    const success = await onResolveTicket(ticket.id, resolution);
    if (success) {
      setIsResolveDialogOpen(false);
      setResolution("");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{ticket.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {getStatusIcon(ticket.status)}
                  <span className="ml-1">{getStatusText(ticket.status)}</span>
                </Badge>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(ticket.priority)}
                  <span className="text-sm">{getPriorityText(ticket.priority)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Cliente:</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {ticket.client?.contact_name?.[0] || ticket.client?.business_name?.[0] || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{ticket.client?.business_name}</p>
                <p className="text-xs text-muted-foreground">{ticket.client?.contact_name}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição:</p>
            <p className="text-sm line-clamp-3">{ticket.description}</p>
          </div>

          {ticket.machine && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Máquina:</p>
              <p className="text-sm">{ticket.machine.serial_number} - {ticket.machine.model}</p>
            </div>
          )}

          {ticket.assigned_user && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Atribuído para:</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {ticket.assigned_user.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{ticket.assigned_user.name}</span>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Criado em {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChat(ticket)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>

            {ticket.status === 'PENDING' && (
              <>
                <Select onValueChange={(value) => onAssignTicket(ticket.id, value)}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Atribuir" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {ticket.status === 'IN_PROGRESS' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResolveDialogOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolver
              </Button>
            )}

            <Select onValueChange={(value) => onUpdateStatus(ticket.id, value as SupportRequestStatus)}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Chamado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Resolução</label>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Descreva como o problema foi resolvido..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResolveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isSubmitting || !resolution.trim()}
            >
              {isSubmitting ? "Resolvendo..." : "Resolver Chamado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
