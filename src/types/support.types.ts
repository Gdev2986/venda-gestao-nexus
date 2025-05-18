
// Support ticket enums
export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum TicketType {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  INQUIRY = "INQUIRY",
  MACHINE = "MACHINE",
  OTHER = "OTHER"
}

// Support ticket interface
export interface SupportTicket {
  id: string;
  title: string;
  client_id: string;
  machine_id?: string;
  user_id?: string; // Added to fix type error, now optional
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  // Replace created_by with user_id 
  // created_by field is removed as user_id is used instead
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
