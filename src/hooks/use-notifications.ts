
import { useNotifications as useNotificationsFromContext } from "@/contexts/notifications/NotificationsContext";
import { NotificationType } from "@/types/notification.types";
import { NotificationsContextProps } from "@/contexts/notifications/types";

export function useHook(): NotificationsContextProps {
  // Fallback mock implementation for when used outside provider during development
  const mockNotifications = [
    {
      id: "1",
      user_id: "1",
      title: "Novo pagamento recebido",
      message: "Você recebeu um novo pagamento de R$ 150,00",
      type: NotificationType.PAYMENT,
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      user_id: "1",
      title: "Atualização do sistema",
      message: "O sistema será atualizado hoje às 22:00",
      type: NotificationType.SYSTEM,
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: "3",
      user_id: "1",
      title: "Nova máquina disponível",
      message: "Um novo modelo de máquina está disponível para solicitação",
      type: NotificationType.MACHINE,
      is_read: false,
      created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  try {
    // Try to use the real context
    return useNotificationsFromContext();
  } catch (error) {
    // Fallback for development
    console.warn("Using mock notifications because useNotifications is not within a provider");
    return {
      notifications: mockNotifications,
      unreadCount: 2,
      soundEnabled: true,
      setSoundEnabled: () => {},
      fetchNotifications: async () => mockNotifications,
      markAsRead: () => {},
      markAllAsRead: () => {},
      isLoading: false,
      deleteNotification: () => {},
      refreshNotifications: async () => mockNotifications
    };
  }
}

// Re-export the actual hook
export { useNotificationsFromContext as useNotifications };
