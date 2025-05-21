
import { SupportRequestType, SupportRequestStatus, SupportRequestPriority } from "@/types/support-request.types";

export interface CreateSupportRequestParams {
  title: string;
  description: string;
  client_id: string;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  scheduled_date?: string | null;
}

export interface UpdateSupportRequestParams {
  title?: string;
  description?: string;
  status?: SupportRequestStatus;
  priority?: SupportRequestPriority;
  type?: SupportRequestType;
  technician_id?: string | null;
  resolution?: string | null;
  scheduled_date?: string | null;
}

export { SupportRequestType, SupportRequestStatus, SupportRequestPriority };
