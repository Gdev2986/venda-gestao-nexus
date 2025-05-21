
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllRequests } from "@/services/support-request/ticket-api";
import { SupportRequestStatus, SupportRequestType, SupportRequestPriority } from "@/types/support-request.types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportTicketsListProps {
  onSelectTicket: (ticketId: string, clientId: string) => void;
  searchTerm?: string;
}

const SupportTicketsList: React.FC<SupportTicketsListProps> = ({ 
  onSelectTicket,
  searchTerm = ""
}) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Helper function to get type label
  const getTypeLabel = (type: string) => {
    switch(type) {
      case SupportRequestType.MAINTENANCE: return "Manutenção";
      case SupportRequestType.INSTALLATION: return "Instalação";
      case SupportRequestType.REPAIR: return "Reparo";
      case SupportRequestType.TRAINING: return "Treinamento";
      case SupportRequestType.SUPPORT: return "Suporte";
      case SupportRequestType.OTHER: return "Outro";
      default: return type;
    }
  };
  
  // Helper function to get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case SupportRequestPriority.HIGH:
        return <Badge variant="outline" className="bg-red-100 text-red-800">Alta</Badge>;
      case SupportRequestPriority.MEDIUM:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case SupportRequestPriority.LOW:
        return <Badge variant="outline" className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Helper function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case SupportRequestStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case SupportRequestStatus.IN_PROGRESS:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case SupportRequestStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluído</Badge>;
      case SupportRequestStatus.CANCELED:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Fetch tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAllRequests();
      if (error) throw error;
      
      // Sort tickets: high priority first, then by creation date
      const sortedTickets = [...data].sort((a, b) => {
        // First by status (pending and in progress first)
        if (a.status === SupportRequestStatus.PENDING && b.status !== SupportRequestStatus.PENDING) return -1;
        if (a.status !== SupportRequestStatus.PENDING && b.status === SupportRequestStatus.PENDING) return 1;
        
        if (a.status === SupportRequestStatus.IN_PROGRESS && b.status !== SupportRequestStatus.IN_PROGRESS && b.status !== SupportRequestStatus.PENDING) return -1;
        if (a.status !== SupportRequestStatus.IN_PROGRESS && a.status !== SupportRequestStatus.PENDING && b.status === SupportRequestStatus.IN_PROGRESS) return 1;
        
        // Then by priority
        if (a.priority === SupportRequestPriority.HIGH && b.priority !== SupportRequestPriority.HIGH) return -1;
        if (a.priority !== SupportRequestPriority.HIGH && b.priority === SupportRequestPriority.HIGH) return 1;
        
        // Then by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setTickets(sortedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tickets de suporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(search) ||
      ticket.description.toLowerCase().includes(search) ||
      ticket.id.toLowerCase().includes(search) ||
      ticket.client_id.toLowerCase().includes(search) ||
      getTypeLabel(ticket.type).toLowerCase().includes(search)
    );
  });
  
  // Initial fetch
  useEffect(() => {
    fetchTickets();
  }, []);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('support_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'support_requests'
        },
        (payload) => {
          // Refresh the tickets list when there are changes
          fetchTickets();
        }
      )
      .subscribe();
      
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Handle ticket selection
  const handleSelectTicket = (ticketId: string, clientId: string) => {
    setSelectedTicketId(ticketId);
    onSelectTicket(ticketId, clientId);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando tickets...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets de Suporte</CardTitle>
        <CardDescription>
          {filteredTickets.length === 0 
            ? "Nenhum ticket encontrado" 
            : `${filteredTickets.length} tickets de suporte encontrados`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredTickets.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Nenhum ticket encontrado com os critérios de busca." 
                : "Não há tickets de suporte no momento."}
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className={selectedTicketId === ticket.id ? "bg-muted/50" : undefined}
                  >
                    <TableCell className="font-mono text-xs">
                      {ticket.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate">
                      {ticket.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getTypeLabel(ticket.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      {format(new Date(ticket.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(ticket.priority)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={selectedTicketId === ticket.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectTicket(ticket.id, ticket.client_id)}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportTicketsList;
