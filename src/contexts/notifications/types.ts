
import { Notification } from "@/types/notification.types";

export interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<Notification[]>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  deleteNotification?: (id: string) => void;
  refreshNotifications?: () => Promise<Notification[]>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}
