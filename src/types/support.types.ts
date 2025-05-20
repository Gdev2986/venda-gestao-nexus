
import { TicketStatus, TicketType, TicketPriority } from './enums';

export {
  TicketStatus,
  TicketType,
  TicketPriority
};

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  type: TicketType;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  client_id: string;
  assignee_id?: string;
  resolution?: string;
  client_name?: string;
  assignee_name?: string;
  machine_id?: string;
  scheduled_date?: string | null;
  client?: any;
  machine?: any;
  user_id?: string;
  assigned_to?: string;
  technician_id?: string;
}

export interface CreateSupportTicketParams {
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  client_id: string;
  user_id?: string;
  machine_id?: string;
  scheduled_date?: string;
  status?: TicketStatus;
  assigned_to?: string;
}

export interface UpdateSupportTicketParams {
  title?: string;
  description?: string;
  type?: TicketType;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee_id?: string;
  resolution?: string;
  client_id?: string;
  machine_id?: string;
  scheduled_date?: string;
  assigned_to?: string;
  technician_id?: string;
}
