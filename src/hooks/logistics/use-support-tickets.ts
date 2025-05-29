
import { useState, useEffect } from "react";
import { 
  SupportTicket, 
  SupportRequestStatus, 
  SupportRequestPriority, 
  SupportRequestType 
} from "@/types/support.types";
import { v4 as uuidv4 } from 'uuid';

// Mock data generator
const generateMockTickets = (count: number): SupportTicket[] => {
  const types = Object.values(SupportRequestType);
  const statuses = Object.values(SupportRequestStatus);
  const priorities = Object.values(SupportRequestPriority);
  
  const mockClients = [
    { id: '1', business_name: 'Supermercado ABC' },
    { id: '2', business_name: 'Farmácia São José' },
    { id: '3', business_name: 'Restaurante Sabor Caseiro' },
    { id: '4', business_name: 'Padaria Bom Pão' },
    { id: '5', business_name: 'Loja Tudo Barato' },
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const clientIndex = Math.floor(Math.random() * mockClients.length);
    const typeIndex = Math.floor(Math.random() * types.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const priorityIndex = Math.floor(Math.random() * priorities.length);
    
    // Generate a date within the next 7 days for scheduled tickets
    const today = new Date();
    const scheduledDate = new Date();
    scheduledDate.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1);
    
    // Generate created_at date within the last 30 days
    const createdDate = new Date();
    createdDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: uuidv4(),
      title: `Ticket de ${types[typeIndex].toString().toLowerCase()} para ${mockClients[clientIndex].business_name}`,
      client_id: mockClients[clientIndex].id,
      type: types[typeIndex],
      status: statuses[statusIndex],
      priority: priorities[priorityIndex],
      description: `Detalhes do ticket de ${types[typeIndex].toString().toLowerCase()} para ${mockClients[clientIndex].business_name}`,
      scheduled_date: scheduledDate.toISOString(),
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString(),
      client: mockClients[clientIndex]
    };
  });
};

interface UseSupportTicketsOptions {
  initialFetch?: boolean;
}

export const useSupportTickets = (options: UseSupportTicketsOptions = {}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (options.initialFetch !== false) {
      fetchTickets();
    }
  }, []);
  
  const fetchTickets = () => {
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      const mockTickets = generateMockTickets(15);
      setTickets(mockTickets);
      setIsLoading(false);
    }, 800);
  };
  
  const addTicket = (ticketData: Partial<SupportTicket>) => {
    return new Promise<SupportTicket>((resolve) => {
      setTimeout(() => {
        const newTicket: SupportTicket = {
          id: uuidv4(),
          title: ticketData.title || '',
          client_id: ticketData.client_id!,
          type: ticketData.type || SupportRequestType.OTHER,
          status: SupportRequestStatus.PENDING,
          priority: ticketData.priority || SupportRequestPriority.MEDIUM,
          description: ticketData.description || '',
          scheduled_date: ticketData.scheduled_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client: ticketData.client
        };
        
        setTickets(prev => [newTicket, ...prev]);
        resolve(newTicket);
      }, 500);
    });
  };
  
  const updateTicketStatus = (ticketId: string, status: SupportRequestStatus) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === ticketId 
              ? { ...ticket, status, updated_at: new Date().toISOString() } 
              : ticket
          )
        );
        resolve();
      }, 500);
    });
  };
  
  const getTicketById = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId) || null;
  };
  
  const getPendingTicketsCount = () => {
    return tickets.filter(ticket => ticket.status === SupportRequestStatus.PENDING).length;
  };
  
  const getTicketsGroupedByStatus = () => {
    return tickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {} as Record<string, SupportTicket[]>);
  };
  
  return {
    tickets,
    isLoading,
    fetchTickets,
    addTicket,
    updateTicketStatus,
    getTicketById,
    getPendingTicketsCount,
    getTicketsGroupedByStatus
  };
};

