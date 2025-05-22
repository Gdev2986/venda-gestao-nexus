
import { useEffect } from 'react';
import { toast } from 'sonner';
import { NotificationType } from '@/types/notification.types';
import { Bell } from 'lucide-react';

interface NotificationToastProps {
  title: string;
  message: string;
  type: NotificationType;
}

export function NotificationToast({ title, message, type }: NotificationToastProps) {
  return (
    <div className="flex gap-3 items-start">
      <div className="bg-primary/10 p-2 rounded-full">
        <Bell className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Função para mostrar uma notificação através do toast
export function showNotificationToast(notification: {
  title: string;
  message: string;
  type: NotificationType;
}) {
  // Instead of using toast.custom, use the standard toast method with JSX
  toast(
    <NotificationToast
      title={notification.title}
      message={notification.message}
      type={notification.type}
    />,
    {
      duration: 5000,
      position: 'top-right',
    }
  );

  // Tenta enviar uma notificação nativa do navegador se permitido
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
    });
  }
}

// Função para solicitar permissão de notificações
export function requestNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
}
