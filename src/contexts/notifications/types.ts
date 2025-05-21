
import { NotificationType } from "@/types/notification.types";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  recipient_roles?: string[]; // Define as optional since it might not exist in all notifications
}

export interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading?: boolean;
  deleteNotification?: (notificationId: string) => Promise<void>;
  refreshNotifications?: () => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}
