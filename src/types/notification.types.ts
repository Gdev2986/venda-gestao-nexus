
import { NotificationType } from "@/types/enums";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  is_read: boolean;
  created_at: string;
  timestamp?: Date; // For compatibility with existing code
  read?: boolean;    // For compatibility with existing code
}
