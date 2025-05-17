
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Archive, 
  Bell, 
  Check, 
  FileText, 
  RefreshCcw, 
  ShoppingCart, 
  Trash
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationType } from "@/types/enums";

export interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => Promise<void>;
  onMarkAsUnread?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAsUnread,
  isLoading = false 
}: NotificationListProps) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.PAYMENT:
        return <FileText className="h-5 w-5 text-blue-500" />;
      case NotificationType.SALE:
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case NotificationType.SYSTEM:
        return <RefreshCcw className="h-5 w-5 text-purple-500" />;
      case NotificationType.BALANCE:
        return <FileText className="h-5 w-5 text-amber-500" />;
      case NotificationType.GENERAL:
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="text-center p-6">
        <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
          <Archive className="h-12 w-12 mb-2" />
          <h3 className="font-medium text-lg">Nenhuma notificação</h3>
          <p>Você não tem notificações para exibir.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`shadow-sm transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                  <div className="flex gap-2">
                    {!notification.read && onMarkAsRead && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como lida
                      </Button>
                    )}
                    {notification.read && onMarkAsUnread && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onMarkAsUnread(notification.id)}
                      >
                        <RefreshCcw className="h-4 w-4 mr-1" />
                        Marcar como não lida
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;
