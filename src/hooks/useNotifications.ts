
import { useState, useEffect } from 'react';
import { Notification, NotificationType } from '@/types';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    title: 'Novo pagamento',
    message: 'Você recebeu um novo pagamento de R$ 250,00',
    type: NotificationType.PAYMENT,
    is_read: false,
    created_at: new Date().toISOString(),
    read: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Atualização de saldo',
    message: 'Seu saldo foi atualizado para R$ 1.250,00',
    type: NotificationType.BALANCE_UPDATE,
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Nova venda',
    message: 'Você registrou uma nova venda de R$ 532,50',
    type: NotificationType.SALE,
    is_read: false,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: false,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

// This is a simple mock implementation - in a real app, this would connect to your backend
export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { 
              ...notification, 
              is_read: true,
              read: true  // For backward compatibility
            } 
          : notification
      )
    );
    return Promise.resolve();
  };

  const markAsUnread = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { 
              ...notification, 
              is_read: false,
              read: false  // For backward compatibility
            } 
          : notification
      )
    );
    return Promise.resolve();
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        is_read: true,
        read: true  // For backward compatibility
      }))
    );
    return Promise.resolve();
  };

  const refreshNotifications = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate getting new notifications
      const newNotification = {
        id: Date.now().toString(),
        title: 'Notificação atualizada',
        message: 'Esta é uma nova notificação do sistema',
        type: NotificationType.SYSTEM,
        is_read: false,
        created_at: new Date().toISOString(),
        read: false,
        timestamp: new Date().toISOString(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setIsLoading(false);
    }, 1000);
  };

  return {
    notifications,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    refreshNotifications
  };
}
