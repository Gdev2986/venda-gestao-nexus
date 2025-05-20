
import { SupportRequestStatus, SupportRequestType, SupportRequestPriority } from './enums';

export interface SupportRequest {
  id: string;
  title: string;
  description: string;
  status: SupportRequestStatus;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  created_at: string;
  updated_at: string;
  client_id: string;
  technician_id?: string;
  scheduled_date?: string;
  resolution?: string;
  client_name?: string;
  technician_name?: string;
}
