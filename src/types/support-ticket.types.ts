
export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export enum TicketType {
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  REMOVAL = "REMOVAL",
  REPLACEMENT = "REPLACEMENT", 
  SUPPLIES = "SUPPLIES", 
  PAPER = "PAPER", 
  OTHER = "OTHER"
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus | string;
  priority: TicketPriority | string;
  type: TicketType | string;
  client_id: string;
  machine_id?: string | null;
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  scheduled_date?: string | null;
  completed_date?: string | null;
  client?: {
    business_name: string;
    address?: string;
    city?: string;
    state?: string;
  };
  machine?: {
    serial_number: string;
    model: string;
  };
  assigned_user?: {
    name: string;
  };
}

export interface CreateSupportTicketParams {
  title: string;
  description: string;
  status: TicketStatus | string;
  priority: TicketPriority | string;
  type: TicketType | string;
  client_id: string;
  machine_id?: string | null;
  assigned_to?: string | null;
  scheduled_date?: string | null;
  created_by: string;
}

export interface UpdateSupportTicketParams {
  title?: string;
  description?: string;
  status?: TicketStatus | string;
  priority?: TicketPriority | string;
  type?: TicketType | string;
  client_id?: string;
  machine_id?: string | null;
  assigned_to?: string | null;
  scheduled_date?: string | null;
  completed_date?: string | null;
}
