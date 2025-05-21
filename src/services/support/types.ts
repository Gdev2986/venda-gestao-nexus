
import { TicketStatus, TicketPriority, TicketType } from "@/types/enums";

export interface SupportTicket {
  id: string;
  title: string;
  client_id: string;
  machine_id?: string;
  user_id?: string;
  assigned_to?: string;
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
  ticket_id?: string;      // Added for compatibility with types.support.ts
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

// Make these type definitions use the enums directly
export interface CreateTicketParams {
  title: string;
  description: string;
  client_id: string;
  machine_id?: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  scheduled_date?: string;
  user_id?: string;
}

export interface UpdateTicketParams {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  assigned_to?: string;
  resolution?: string;
  scheduled_date?: string;
}

// Export the enums for convenience
export { TicketStatus, TicketPriority, TicketType };
