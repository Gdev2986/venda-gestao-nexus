
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
}
