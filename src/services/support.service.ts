
import { TicketStatus, TicketType, TicketPriority } from '@/types/enums';
import { SupportTicket, CreateSupportTicketParams, UpdateSupportTicketParams } from '@/types/support.types';

// Mock data for support tickets
const mockTickets: SupportTicket[] = [
  {
    id: "1",
    title: "Problema na máquina",
    client_id: "c1",
    type: TicketType.TECHNICAL,
    status: TicketStatus.PENDING,
    priority: TicketPriority.MEDIUM,
    description: "A máquina está apresentando falhas intermitentes.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "u1",
    client: {
      id: "c1",
      business_name: "Comércio Exemplo"
    }
  },
  {
    id: "2",
    title: "Precisa de manutenção",
    client_id: "c2",
    machine_id: "m1",
    type: TicketType.MAINTENANCE,
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    description: "Máquina precisa de manutenção preventiva.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    user_id: "u2",
    client: {
      id: "c2",
      business_name: "Loja Teste"
    },
    machine: {
      id: "m1",
      serial_number: "SN123456",
      model: "ModelX"
    }
  }
];

/**
 * Gets a list of all support tickets with optional filtering
 */
export const getSupportTickets = async (
  filters?: { clientId?: string; status?: TicketStatus; type?: TicketType; }
): Promise<SupportTicket[]> => {
  // Apply filters to mock data
  let filteredTickets = [...mockTickets];
  
  if (filters?.clientId) {
    filteredTickets = filteredTickets.filter(ticket => ticket.client_id === filters.clientId);
  }
  
  if (filters?.status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
  }

  if (filters?.type) {
    filteredTickets = filteredTickets.filter(ticket => ticket.type === filters.type);
  }

  return Promise.resolve(filteredTickets);
};

/**
 * Gets support tickets by client ID
 */
export const getClientSupportTickets = async (clientId: string): Promise<SupportTicket[]> => {
  return getSupportTickets({ clientId });
};

/**
 * Gets support tickets by type
 */
export const getSupportTicketsByType = async (type: TicketType): Promise<SupportTicket[]> => {
  return getSupportTickets({ type });
};

/**
 * Gets a single support ticket by ID
 */
export const getSupportTicketById = async (id: string): Promise<SupportTicket | null> => {
  const ticket = mockTickets.find(ticket => ticket.id === id);
  return Promise.resolve(ticket || null);
};

/**
 * Creates a new support ticket
 */
export const createSupportTicket = async (ticket: CreateSupportTicketParams): Promise<SupportTicket> => {
  const newTicket: SupportTicket = {
    id: `ticket-${Date.now()}`,
    title: ticket.title,
    description: ticket.description,
    client_id: ticket.client_id,
    machine_id: ticket.machine_id,
    user_id: ticket.user_id || "unknown-user",
    type: ticket.type,
    status: ticket.status || TicketStatus.PENDING,
    priority: ticket.priority,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: ticket.assigned_to,
    client: {
      id: ticket.client_id,
      business_name: "Cliente Mock"
    }
  };
  
  // In a real implementation, we would add this to the database
  mockTickets.push(newTicket);
  
  return Promise.resolve(newTicket);
};

/**
 * Updates an existing support ticket
 */
export const updateSupportTicket = async (id: string, updates: UpdateSupportTicketParams): Promise<SupportTicket | null> => {
  const ticketIndex = mockTickets.findIndex(ticket => ticket.id === id);
  
  if (ticketIndex === -1) {
    return Promise.resolve(null);
  }
  
  const existingTicket = mockTickets[ticketIndex];
  
  const updatedTicket: SupportTicket = {
    ...existingTicket,
    title: updates.title !== undefined ? updates.title : existingTicket.title,
    description: updates.description !== undefined ? updates.description : existingTicket.description,
    status: updates.status !== undefined ? updates.status : existingTicket.status,
    priority: updates.priority !== undefined ? updates.priority : existingTicket.priority,
    type: updates.type !== undefined ? updates.type : existingTicket.type,
    assigned_to: updates.assigned_to !== undefined ? updates.assigned_to : existingTicket.assigned_to,
    technician_id: updates.technician_id !== undefined ? updates.technician_id : existingTicket.technician_id,
    updated_at: new Date().toISOString()
  };
  
  // In a real implementation, we would update the database
  mockTickets[ticketIndex] = updatedTicket;
  
  return Promise.resolve(updatedTicket);
};
