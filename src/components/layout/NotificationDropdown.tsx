
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, MailCheck, Loader2 } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { notificationService } from "@/services/NotificationService";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();
  const { userRole } = useUserRole();

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Get only 5 latest notifications
        const { notifications } = await NotificationService.getNotifications(
          user.id, 
          1, 
          5
        );
        setNotifications(notifications);
        
        // Count unread notifications
        const count = await NotificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Setup polling for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };
  
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };
  
  const getNotificationLink = () => {
    if (userRole === UserRole.ADMIN) {
      return "/admin/notifications";
    }
    return "/notifications";
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <MailCheck className="mr-1 h-3 w-3" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length > 0 ? (
          <>
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className={`${!notification.read ? 'bg-muted/50' : ''} cursor-default`}>
                  <div className="flex flex-col w-full gap-1 py-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary ml-auto" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-default" asChild>
              <Link to={getNotificationLink()} className="w-full text-center text-sm text-primary">
                Ver todas as notificações
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="py-4 px-2 text-center text-sm text-muted-foreground">
            Nenhuma notificação encontrada.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
