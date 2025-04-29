
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'MACHINE_TRANSFERRED' | 'SUPPORT_REPLY' | 'GENERAL';
  is_read: boolean;
  created_at: string;
  data?: any;
}

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Pagamento Aprovado',
    message: 'Seu pagamento de R$ 1.500,00 foi aprovado',
    type: 'PAYMENT_APPROVED',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    data: { payment_id: '1', amount: 1500 }
  },
  {
    id: '2',
    title: 'Máquina Transferida',
    message: 'A máquina #XYZ-123 foi transferida para você',
    type: 'MACHINE_TRANSFERRED',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    data: { machine_id: '123', serial: 'XYZ-123' }
  },
  {
    id: '3',
    title: 'Nova Resposta no Suporte',
    message: 'Você recebeu uma nova resposta no seu ticket de suporte',
    type: 'SUPPORT_REPLY',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    data: { conversation_id: '456' }
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'PAYMENT_APPROVED':
      return <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>;
    case 'PAYMENT_REJECTED':
      return <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>;
    case 'MACHINE_TRANSFERRED':
      return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>;
    case 'SUPPORT_REPLY':
      return <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>;
    default:
      return <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>;
  }
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    if (!notification.is_read) {
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'PAYMENT_APPROVED':
      case 'PAYMENT_REJECTED':
        // Navigate to payments page
        // window.location.href = '/payments';
        break;
      case 'MACHINE_TRANSFERRED':
        // Navigate to machines page
        // window.location.href = '/machines';
        break;
      case 'SUPPORT_REPLY':
        // Navigate to support page
        // window.location.href = '/support';
        break;
      default:
        break;
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center text-[10px] bg-red-500"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <DropdownMenuItem 
                    className={`flex flex-col items-start p-3 cursor-pointer ${!notification.is_read ? 'bg-muted/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center w-full">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium">{notification.title}</span>
                      {!notification.is_read && (
                        <div className="ml-auto rounded-full w-2 h-2 bg-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 pl-4">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 pl-4">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))
            ) : (
              <div className="p-3 text-center text-muted-foreground">
                Nenhuma notificação disponível
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
