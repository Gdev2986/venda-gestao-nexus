
export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED"
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
  BUG = "BUG"
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
