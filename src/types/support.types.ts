
export enum SupportRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum SupportRequestType {
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
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
  machine_id?: string;
  assigned_to?: string;
  type: SupportRequestType;
  status: SupportRequestStatus; 
  priority: SupportRequestPriority;
  scheduled_date?: string;
  created_at: string;
  updated_at?: string;
  title: string;
  description: string;
  resolution?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  client?: {
    id: string;
    business_name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
  };
  machine?: {
    id: string;
    serial_number: string;
    model: string;
  };
  assigned_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
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
  machine_id?: string;
  attachments?: File[];
}

export interface CreateMessageParams {
  ticket_id: string;
  message: string;
  attachments?: File[];
}
