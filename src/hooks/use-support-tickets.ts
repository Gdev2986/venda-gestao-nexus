
import { useState, useEffect } from "react";
import { 
  SupportTicket, 
  SupportRequestStatus, 
  SupportRequestType,
  SupportRequestPriority,
  CreateSupportTicketParams 
} from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";
import { v4 as uuidv4 } from 'uuid';

const generateMockTickets = (clientId: string, count: number = 5): SupportTicket[] => {
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
  
  return Array.from({ length: count }).map(() => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    return {
      id: uuidv4(),
      client_id: clientId,
      technician_id: Math.random() > 0.5 ? uuidv4() : undefined,
      type,
      status,
      priority,
      title: `Solicitação de ${type}`,
      description: `Descrição detalhada da solicitação de ${type.toLowerCase()}`,
      scheduled_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      resolution: status === SupportRequestStatus.COMPLETED ? 'Problema resolvido com sucesso' : undefined,
      client: {
        id: clientId,
        business_name: 'Meu Negócio',
        contact_name: 'Cliente Teste',
        phone: '(11) 99999-9999',
        email: 'cliente@teste.com'
      }
    };
  });
};

export const useSupportTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        const mockTickets = generateMockTickets(user.id);
        setTickets(mockTickets);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const createTicket = async (params: CreateSupportTicketParams): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const newTicket: SupportTicket = {
        id: uuidv4(),
        client_id: user.id,
        type: params.type,
        status: SupportRequestStatus.PENDING,
        priority: params.priority,
        title: params.title,
        description: params.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: user.id,
          business_name: user.name,
          contact_name: user.name,
          email: user.email
        }
      };

      setTickets(prev => [newTicket, ...prev]);
      return true;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return false;
    }
  };

  return {
    tickets,
    isLoading,
    createTicket
  };
};

