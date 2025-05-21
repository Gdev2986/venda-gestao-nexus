
export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  OPEN = "OPEN"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
  URGENT = "URGENT"
}

export enum TicketType {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  INQUIRY = "INQUIRY",
  MACHINE = "MACHINE",
  OTHER = "OTHER",
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  REMOVAL = "REMOVAL",
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  PAPER = "PAPER",
  GENERAL = "GENERAL",
  FEATURE = "FEATURE",
  BUG = "BUG"
}

// Support ticket interface
export interface SupportTicket {
  id: string;
  title: string;
  client_id: string;
  machine_id?: string;
  user_id?: string; // Made optional
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string; // Added for backward compatibility
  assigned_to?: string; // Added for compatibility
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

// Create and update params for support tickets
export interface CreateSupportTicketParams {
  title: string;
  description: string;
  client_id: string;
  machine_id?: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  assigned_to?: string;
  created_by?: string;
  user_id?: string;
}

export interface UpdateSupportTicketParams {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  assigned_to?: string;
  user_id?: string;
}
