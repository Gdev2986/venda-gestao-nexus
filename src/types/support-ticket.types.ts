
import { TicketStatus, TicketType, TicketPriority } from './enums';

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
}
