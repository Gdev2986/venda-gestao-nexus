
export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum TicketType {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  GENERAL = "GENERAL",
  FEATURE = "FEATURE",
  BUG = "BUG",
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
  REMOVAL = "REMOVAL",
  REPLACEMENT = "REPLACEMENT",
  PAPER = "PAPER",
  SUPPLIES = "SUPPLIES",
  OTHER = "OTHER"
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  client_id?: string;
  machine_id?: string;
  scheduled_date?: string;
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
  title: string;
  description: string;
  priority: TicketPriority;
  type: TicketType;
}

export interface UpdateSupportTicketParams {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  assigned_to?: string;
}
