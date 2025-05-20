
// Export enums
export { 
  SupportRequestStatus, 
  SupportRequestType, 
  SupportRequestPriority 
} from './enums';

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
