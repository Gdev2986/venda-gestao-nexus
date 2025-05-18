
import { NotificationType } from './enums';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  is_read?: boolean;
  created_at: string;
  recipients?: "all" | "admins" | "clients"; // Optional field for sending notifications
}
