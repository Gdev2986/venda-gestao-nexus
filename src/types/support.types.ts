
// Support system types
export enum TicketType {
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION", 
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  REMOVAL = "REMOVAL",
  OTHER = "OTHER"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export interface SupportTicket {
  id: string;
  client_id: string;
  technician_id?: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  resolution?: string;
  client?: {
    business_name: string;
  };
}

export interface SupportConversation {
  id: string;
  support_request_id: string;
  client_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateTicketParams {
  description: string;
  type: TicketType;
  priority: TicketPriority;
  client_id: string;
}
