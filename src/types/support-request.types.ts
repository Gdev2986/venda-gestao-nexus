
// Export enums
export enum SupportRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum SupportRequestType {
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
  OTHER = "OTHER",
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  REMOVAL = "REMOVAL"
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
