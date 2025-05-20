
import { TicketType, TicketPriority, TicketStatus } from "@/types/support-ticket.types";

export type SupportRequest = {
  id?: string;
  client_id: string;
  technician_id?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  description: string;
  scheduled_date?: string | null;
  resolution?: string | null;
  created_at?: string;
  updated_at?: string;
  client?: {
    id: string;
    business_name: string;
    contact_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  technician?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
};

export type SupportRequestFilters = {
  status?: TicketStatus;
  type?: TicketType;
  priority?: TicketPriority;
  client_id?: string;
  technician_id?: string;
  date_from?: string;
  date_to?: string;
};
