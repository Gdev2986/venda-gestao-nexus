
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";
import { 
  TicketStatus as TicketStatusEnum, 
  TicketPriority as TicketPriorityEnum, 
  TicketType as TicketTypeEnum, 
  NotificationType as NotificationTypeEnum, 
  UserRole as UserRoleEnum 
} from "@/types/enums";

// Re-export enums for direct use
export const TicketStatus = TicketStatusEnum;
export const TicketPriority = TicketPriorityEnum;
export const TicketType = TicketTypeEnum;
export const NotificationType = NotificationTypeEnum;
export const UserRole = UserRoleEnum;

export type { 
  TicketStatusEnum as TicketStatus, 
  TicketPriorityEnum as TicketPriority, 
  TicketTypeEnum as TicketType, 
  NotificationTypeEnum as NotificationType,
  UserRoleEnum as UserRole
};

export interface SupportTicket {
  id: string;
  title: string;
  client_id: string;
  machine_id?: string;
  user_id?: string;
  assigned_to?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  scheduled_date?: string;
  resolution?: string;
  created_at: string;
  updated_at?: string;
  client?: {
    id: string;
    business_name: string;
    contact_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  machine?: {
    id: string;
    serial_number: string;
    model: string;
  };
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
  };
}

export interface CreateTicketParams {
  title: string;
  description: string;
  client_id: string;
  machine_id?: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  scheduled_date?: string;
  user_id?: string;
}

export interface UpdateTicketParams {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  assigned_to?: string;
  resolution?: string;
  scheduled_date?: string;
}

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  type?: TicketType | TicketType[];
  priority?: TicketPriority;
  client_id?: string;
  assigned_to?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface NotificationData {
  ticket_id: string;
  priority?: TicketPriority;
  new_status?: TicketStatus;
}
