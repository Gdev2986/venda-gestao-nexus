
import { 
  SupportRequest, 
  SupportMessage, 
  SupportRequestStatus, 
  SupportRequestType, 
  SupportRequestPriority 
} from "@/types/support-request.types";

// Re-export types for convenience
export type {
  SupportRequest,
  SupportMessage,
  SupportRequestStatus,
  SupportRequestType,
  SupportRequestPriority
};

// Define filter interfaces
export interface TicketFilters {
  status?: SupportRequestStatus | SupportRequestStatus[];
  client_id?: string;
  technician_id?: string;
  type?: SupportRequestType | SupportRequestType[];
  priority?: SupportRequestPriority;
  search?: string;
}

export interface TicketStats {
  pendingRequests: number;
  highPriorityRequests: number;
  typeCounts: Record<string, number>;
  totalRequests?: number; 
  // Os campos a seguir não são retornados pelo serviço:
  resolvedRequests?: number;
  supportAgents?: number;
}

export interface MessageData {
  ticket_id: string;
  user_id: string;
  message: string;
}
