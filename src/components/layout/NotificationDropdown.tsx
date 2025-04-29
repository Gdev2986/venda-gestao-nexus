
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'MACHINE_TRANSFERRED' | 'SUPPORT_REPLY' | 'GENERAL';
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Pagamento Aprovado",
        message: "Seu pagamento de R$ 1.250,00 foi aprovado",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        type: "PAYMENT_APPROVED"
      },
      {
        id: "2",
        title: "Nova Mensagem de Suporte",
        message: "Você recebeu uma resposta do suporte técnico",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        type: "SUPPORT_REPLY"
      },
      {
        id: "3",
        title: "Máquina Transferida",
        message: "A máquina T12345 foi transferida para outro cliente",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        type: "MACHINE_TRANSFERRED"
      },
      {
        id: "4",
        title: "Pagamento Rejeitado",
        message: "Seu pagamento de R$ 550,00 foi rejeitado",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        type: "PAYMENT_REJECTED"
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    
    // Simulate a new notification after 10 seconds
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: "5",
        title: "Nova Venda Registrada",
        message: "Uma nova venda foi registrada no valor de R$ 350,00",
        timestamp: new Date(),
        read: false,
        type: "GENERAL"
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast({
        title: "Nova Notificação",
        description: "Uma nova venda foi registrada",
      });
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => {
      if (notification.id === id && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        return { ...notification, read: true };
      }
      return notification;
    }));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };
  
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return timestamp.toLocaleDateString();
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'PAYMENT_APPROVED':
        return 'bg-green-100 text-green-600';
      case 'PAYMENT_REJECTED':
        return 'bg-red-100 text-red-600';
      case 'SUPPORT_REPLY':
        return 'bg-blue-100 text-blue-600';
      case 'MACHINE_TRANSFERRED':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge variant="destructive" className="h-5 min-w-[20px] flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto py-1">
          <AnimatePresence initial={false}>
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <DropdownMenuItem 
                    className={`p-0 focus:bg-transparent cursor-default ${notification.read ? 'opacity-70' : ''}`}
                  >
                    <div className="flex gap-3 p-3 w-full" onClick={() => markAsRead(notification.id)}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationIcon(notification.type)}`}>
                        {notification.type === 'PAYMENT_APPROVED' && '$'}
                        {notification.type === 'PAYMENT_REJECTED' && '!'}
                        {notification.type === 'SUPPORT_REPLY' && '?'}
                        {notification.type === 'MACHINE_TRANSFERRED' && 'T'}
                        {notification.type === 'GENERAL' && 'N'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 self-center"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-2 text-center">
          <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Ver todas", description: "Função em desenvolvimento." })}>
            Ver todas
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
