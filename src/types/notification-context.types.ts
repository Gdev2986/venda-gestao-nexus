
import { NotificationType, Notification } from "@/types/notification.types";

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
