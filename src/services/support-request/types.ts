
import { SupportRequestType, SupportRequestStatus, SupportRequestPriority } from "@/types/support-request.types";

export interface CreateSupportRequestParams {
  title: string;
  description: string;
  client_id: string;
  type: string;  // Changed from SupportRequestType to string
  priority: string;  // Changed from SupportRequestPriority to string
  scheduled_date?: string | null;
}

export interface UpdateSupportRequestParams {
  title?: string;
  description?: string;
  status?: string;  // Changed from SupportRequestStatus to string
  priority?: string;  // Changed from SupportRequestPriority to string
  type?: string;  // Changed from SupportRequestType to string
  technician_id?: string | null;
  resolution?: string | null;
  scheduled_date?: string | null;
}

// Re-export the enum types for convenience
export { SupportRequestType, SupportRequestStatus, SupportRequestPriority };
