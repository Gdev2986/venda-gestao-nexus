
export enum TicketType {
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  REMOVAL = "REMOVAL",
  OTHER = "OTHER"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
  URGENT = "URGENT"
}

export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  RESOLVED = "RESOLVED"
}

export interface SupportTicket {
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
}
