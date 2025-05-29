
import { useState, useEffect } from "react";
import { 
  SupportTicket, 
  SupportRequestStatus, 
  SupportRequestType,
  SupportRequestPriority 
} from "@/types/support.types";
import { v4 as uuidv4 } from 'uuid';

// Mock data that matches database schema
const generateMockTickets = (count: number): SupportTicket[] => {
  const types = [
    SupportRequestType.MAINTENANCE,
    SupportRequestType.INSTALLATION,
    SupportRequestType.REPLACEMENT,
    SupportRequestType.SUPPLIES,
    SupportRequestType.REMOVAL,
    SupportRequestType.OTHER
  ];
  
  const statuses = [
    SupportRequestStatus.PENDING,
    SupportRequestStatus.IN_PROGRESS,
    SupportRequestStatus.COMPLETED,
    SupportRequestStatus.CANCELED
  ];
  
  const priorities = [
    SupportRequestPriority.LOW,
    SupportRequestPriority.MEDIUM,
    SupportRequestPriority.HIGH
  ];
  
  const mockClients = [
    { id: '1', business_name: 'Supermercado ABC', contact_name: 'João Silva', phone: '(11) 99999-9999', email: 'joao@abc.com' },
    { id: '2', business_name: 'Farmácia São José', contact_name: 'Maria Santos', phone: '(11) 88888-8888', email: 'maria@farmacia.com' },
    { id: '3', business_name: 'Restaurante Sabor', contact_name: 'Pedro Lima', phone: '(11) 77777-7777', email: 'pedro@sabor.com' },
  ];
  
  return Array.from({ length: count }).map(() => {
    const client = mockClients[Math.floor(Math.random() * mockClients.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    return {
      id: uuidv4(),
      client_id: client.id,
      technician_id: Math.random() > 0.5 ? uuidv4() : undefined,
      type,
      status,
      priority,
      title: `${type} para ${client.business_name}`,
      description: `Solicitação de ${type.toLowerCase()} para o cliente ${client.business_name}`,
      scheduled_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      resolution: status === SupportRequestStatus.COMPLETED ? 'Problema resolvido com sucesso' : undefined,
      client
    };
  });
};

export const useAdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTickets = generateMockTickets(20);
      setTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const updateTicketStatus = async (ticketId: string, status: SupportRequestStatus): Promise<boolean> => {
    try {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updated_at: new Date().toISOString() }
            : ticket
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return false;
    }
  };

  const assignTicket = async (ticketId: string, assignedTo: string): Promise<boolean> => {
    try {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { 
                ...ticket, 
                technician_id: assignedTo,
                status: SupportRequestStatus.IN_PROGRESS,
                updated_at: new Date().toISOString() 
              }
            : ticket
        )
      );
      return true;
    } catch (error) {
      console.error('Error assigning ticket:', error);
      return false;
    }
  };

  const resolveTicket = async (ticketId: string, resolution: string): Promise<boolean> => {
    try {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { 
                ...ticket, 
                status: SupportRequestStatus.COMPLETED,
                resolution,
                updated_at: new Date().toISOString() 
              }
            : ticket
        )
      );
      return true;
    } catch (error) {
      console.error('Error resolving ticket:', error);
      return false;
    }
  };

  const supportAgents = [
    { id: '1', name: 'Ana Silva', email: 'ana@empresa.com' },
    { id: '2', name: 'Carlos Santos', email: 'carlos@empresa.com' },
    { id: '3', name: 'Maria Oliveira', email: 'maria@empresa.com' },
  ];

  return {
    tickets,
    isLoading,
    updateTicketStatus,
    assignTicket,
    resolveTicket,
    supportAgents
  };
};

