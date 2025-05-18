import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  Notification as NotificationType,
} from "@/contexts/NotificationsContext";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatRelativeTime = (dateString: string) => {
  return formatRelative(new Date(dateString), new Date(), {
    locale: ptBR,
    weekStartsOn: 1,
  });
};

const NotificationItem = ({
  notification,
  markAsRead,
  deleteNotification,
}: {
  notification: NotificationType;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}) => {
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsRead = async () => {
    setIsMarkingAsRead(true);
    try {
      await markAsRead(notification.id);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const handleDeleteNotification = async () => {
    setIsDeleting(true);
    try {
      await deleteNotification(notification.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenuItem className="gap-4">
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <DropdownMenuShortcut>
            <Badge variant={notification.is_read ? "outline" : "default"}>
              {notification.is_read ? "Lida" : "Nova"}
            </Badge>
          </DropdownMenuShortcut>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMarkAsRead}
            disabled={isMarkingAsRead}
          >
            {isMarkingAsRead ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80"
            onClick={handleDeleteNotification}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm font-semibold">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </DropdownMenuItem>
  );
};

export function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);
      try {
        await refreshNotifications();
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchData();
  }, [refreshNotifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 rounded-full px-1.5 py-0 text-xs"
            >
              {unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="flex items-center justify-between pl-4 pr-2 pt-2">
          <p className="text-sm font-medium">Notificações</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshNotifications}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[400px] flex-1">
          {loading ? (
            <DropdownMenuItem className="justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando notificações...
            </DropdownMenuItem>
          ) : notifications.length === 0 ? (
            <DropdownMenuItem className="justify-center">
              Nenhuma notificação
            </DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
              />
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <a href="/notifications">Ver todas</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
