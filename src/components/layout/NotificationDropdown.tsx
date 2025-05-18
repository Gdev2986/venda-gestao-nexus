
import React, { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationsContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const NotificationDropdown: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    isLoading 
  } = useNotifications();
  
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // If dropdown closes, update any viewed notifications
    if (!open && notifications.some(n => !n.is_read)) {
      // Get notifications that were shown but are still unread
      const viewedIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);
      
      if (viewedIds.length > 0) {
        // Only mark as read if there are some to mark
        markAllAsRead();
      }
    }
  }, [open, notifications, markAllAsRead]);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive" 
              variant="outline"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h4 className="font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto py-1 px-2 text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Carregando notificações...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div key={notification.id} className="group">
                  <DropdownMenuItem 
                    className={`flex flex-col items-start p-3 border-b last:border-0 cursor-default ${
                      !notification.is_read ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-medium">
                        {notification.title}
                        {!notification.is_read && (
                          <span className="inline-block ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </span>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!notification.is_read) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.timestamp), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </DropdownMenuItem>
                </div>
              ))}
            </>
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 flex justify-center">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/notifications">Ver todas</a>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
