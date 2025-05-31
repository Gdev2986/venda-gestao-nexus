
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { SupportTicket, TicketStatus } from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";
import { useTicketManagement } from "@/hooks/use-ticket-management";

interface TicketStatusManagerProps {
  ticket: SupportTicket;
  onTicketUpdate?: () => void; // Callback when ticket is updated
}

export const TicketStatusManager = ({ 
  ticket, 
  onTicketUpdate
}: TicketStatusManagerProps) => {
  const { user, userRole } = useAuth();
  const { isUpdating, updateTicketStatus, assignTicketToMe } = useTicketManagement();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50"><User className="h-3 w-3 mr-1" />Em Andamento</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Concluído</Badge>;
      case "CANCELED":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTicketStatus(ticket.id, newStatus as TicketStatus);
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAssignToMe = async () => {
    try {
      await assignTicketToMe(ticket.id);
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  // Only show management controls for admins and logistics
  if (userRole !== 'ADMIN' && userRole !== 'LOGISTICS') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status do Chamado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(ticket.status)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Prioridade:</span>
            {getPriorityBadge(ticket.priority)}
          </div>
          {ticket.assigned_to && (
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Em atendimento</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Gerenciar Chamado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge(ticket.status)}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Prioridade:</span>
          {getPriorityBadge(ticket.priority)}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alterar Status:</label>
          <Select
            value={ticket.status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="CANCELED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assumir Atendimento button */}
        {ticket.status === "PENDING" && !ticket.assigned_to && (
          <Button 
            onClick={handleAssignToMe}
            disabled={isUpdating}
            className="w-full"
            size="sm"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Assumir Atendimento
          </Button>
        )}

        {/* Show current attendant */}
        {ticket.assigned_to && (
          <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
            <div className="flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-green-600" />
              <span className="text-green-700">
                Atendimento assumido por: {ticket.assigned_to === user?.id ? "Você" : "Outro técnico"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
