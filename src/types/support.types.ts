
export enum SupportRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

// Match the database enum exactly
export enum SupportRequestType {
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
  REPLACEMENT = "REPLACEMENT", 
  SUPPLIES = "SUPPLIES",
  REMOVAL = "REMOVAL",
  REPAIR = "REPAIR",
  TRAINING = "TRAINING",
  SUPPORT = "SUPPORT",
  OTHER = "OTHER"
}

export enum SupportRequestPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export interface SupportTicket {
  id: string;
  client_id: string;
  technician_id?: string;
  type: SupportRequestType;
  status: SupportRequestStatus; 
  priority: SupportRequestPriority;
  scheduled_date?: string;
  created_at: string;
  updated_at?: string;
  title: string;
  description: string;
  resolution?: string;
  machine_id?: string;
  client?: {
    id: string;
    business_name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
  };
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user?: {
    id: string;
    name: string;
    role: string;
    email?: string;
  };
}

export interface CreateSupportTicketParams {
  title: string;
  description: string;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  client_id: string;
  machine_id?: string;
  attachments?: File[];
}

export interface CreateMessageParams {
  conversation_id: string;
  message: string;
}
