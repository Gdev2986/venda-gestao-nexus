
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import notificationService from "@/services/NotificationService";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications({
    pageSize: 5,
    page: 1
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchNotifications(1, 5);
    }
  }, [open, fetchNotifications]);

  const handleViewAll = () => {
    navigate(PATHS.NOTIFICATIONS);
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    const { user } = await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleClickNotification = async (id: string) => {
    await markAsRead(id);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">Notificações</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`px-4 py-3 cursor-pointer flex flex-col items-start ${
                  !notification.is_read ? "bg-muted/50" : ""
                }`}
                onClick={() => handleClickNotification(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        <div className="p-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewAll}
          >
            Ver todas
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
