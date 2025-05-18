
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, ShoppingCart, CreditCard, Wrench, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const NotificationList = ({ 
  notifications, 
  onMarkAsRead,
  onDelete,
  isLoading = false
}: NotificationListProps) => {

  const getIcon = (type: string) => {
    switch (type) {
      case "SALE":
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case "PAYMENT":
      case "PAYMENT_APPROVED":
      case "PAYMENT_REJECTED":
        return <CreditCard className="h-4 w-4 text-primary" />;
      case "MACHINE":
        return <Wrench className="h-4 w-4 text-primary" />;
      case "SUPPORT":
        return <LifeBuoy className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-4 px-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma notificação encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 flex items-start hover:bg-muted/50 transition-colors ${notification.is_read ? 'opacity-70' : ''}`}
          >
            <div className="mr-4 mt-1">{getIcon(notification.type)}</div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="text-sm font-medium flex-1">{notification.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { 
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
              
              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              
              <div className="mt-2 flex items-center gap-2">
                {notification.is_read ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs"
                  >
                    Lida
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
                
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
                    onClick={() => onDelete(notification.id)}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </div>
            
            {!notification.is_read && (
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
