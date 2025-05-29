
import { TicketStatus, TicketPriority, TicketType } from "./enums";

export interface SupportTicket {
  id: string;
  title: string;
  client_id: string;
  machine_id?: string;
  technician_id?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
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
  machine?: {
    id: string;
    serial_number: string;
    model: string;
  };
}

export interface SupportMessage {
  id: string;
  conversation_id: string; // This matches the database schema
  ticket_id?: string;      // Added for compatibility
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
  title: string;
  description: string;
  client_id: string;
  machine_id?: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  scheduled_date?: string;
  attachments?: File[];
}

export interface UpdateTicketParams {
  title?: string;
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
