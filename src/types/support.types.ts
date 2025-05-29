
import { TicketStatus, TicketPriority, TicketType } from "./enums";

export interface SupportTicket {
  id: string;
  description: string;
  client_id: string;
  technician_id?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  scheduled_date?: string;
  resolution?: string;
  created_at: string;
  updated_at?: string;
  client?: {
    id: string;
    business_name: string;
    contact_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  ticket_id?: string;
  user_id: string;
  message: string;
  created_at: string;
  is_read?: boolean;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface CreateTicketParams {
  description: string;
  client_id: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  scheduled_date?: string;
  // Removed attachments since it's not supported by the database
}

export interface UpdateTicketParams {
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  technician_id?: string;
  resolution?: string;
  scheduled_date?: string;
}

// Export the enums to fix the "locally declared but not exported" errors
export { TicketStatus, TicketPriority, TicketType };
