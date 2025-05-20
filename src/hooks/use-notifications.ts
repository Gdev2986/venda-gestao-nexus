
import * as React from "react";
import { toast } from "@/hooks/use-toast"; // Direct import from our hook
import { Notification } from "@/types/notification.types";

// This is a simplified hook that doesn't actually fetch real notifications
// The real functionality is in NotificationsContext
export function useNotifications() {
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(
    localStorage.getItem("notification-sound") !== "false"
  );
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  
  // Load sound preference from localStorage on mount
  React.useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("notification-sound");
      setSoundEnabled(savedPreference !== "false");
    } catch (error) {
      console.error("Failed to load notification sound preference:", error);
    }
  }, []);

  // Save sound preference when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem("notification-sound", String(soundEnabled));
    } catch (error) {
      console.error("Failed to save notification sound preference:", error);
    }
  }, [soundEnabled]);

  // Toggle sound function
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    
    toast({
      title: newValue ? "Som ativado" : "Som desativado",
      description: newValue ? 
        "Você receberá notificações sonoras" : 
        "Notificações sonoras foram desativadas",
    });
  };

  // Mock functions for standalone usage without the context
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, is_read: true} : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({...n, is_read: true}))
    );
    setUnreadCount(0);
  };
  
  return {
    soundEnabled,
    setSoundEnabled: toggleSound,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
