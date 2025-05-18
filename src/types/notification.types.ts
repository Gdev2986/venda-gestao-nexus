
import { NotificationType as NotificationTypeEnum } from "@/types/enums";

export { NotificationTypeEnum as NotificationType };

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  data?: any;
  is_read: boolean;
  created_at: string;
  timestamp?: Date; // For compatibility with existing code
  read?: boolean;    // For compatibility with existing code
}
