
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

export interface SupportRequest {
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
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    role: string;
  }
}
