
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
  PAPER = "PAPER",
  SUPPLIES = "SUPPLIES",
  OTHER = "OTHER"
}

export interface SupportTicket {
  id: string;
  client_id: string;
  machine_id?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  client?: {
    id: string;
    business_name: string;
  };
  machine?: {
    id: string;
    serial_number: string;
    model: string;
  };
}

export interface CreateSupportTicketParams {
  client_id: string;
  machine_id?: string;
  type: TicketType;
  priority: TicketPriority;
  description: string;
  scheduled_date?: string;
  created_by: string;
}

export interface UpdateSupportTicketParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  description?: string;
  scheduled_date?: string;
  assigned_to?: string;
  machine_id?: string;
}
