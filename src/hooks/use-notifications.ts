
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast"; 
import { Notification, NotificationType } from "@/types/notification.types";

export function useNotifications() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const savedPreference = localStorage.getItem("notification-sound");
      return savedPreference !== "false";
    } catch (error) {
      console.error("Failed to load notification sound preference:", error);
      return true; // Default to enabled
    }
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Save sound preference when it changes
  useEffect(() => {
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

  // Mock fetchNotifications function for standalone usage
  const fetchNotifications = async () => {
    setIsLoading(true);
    
    try {
      // Simular atraso de rede para demonstração
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados mockados para teste
      const mockData: Notification[] = [
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
      
      setNotifications(mockData);
      
      // Atualizar contador de não lidas
      const unread = mockData.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
      return mockData;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      toast("Erro ao buscar notificações");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

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
    toast({
      title: "Notificações lidas",
      description: "Todas as notificações foram marcadas como lidas"
    });
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso"
    });
  };
  
  return {
    soundEnabled,
    setSoundEnabled: toggleSound,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    deleteNotification,
    isLoading
  };
}
