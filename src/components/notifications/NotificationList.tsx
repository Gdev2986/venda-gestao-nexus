
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, ShoppingCart, CreditCard, Wrench, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import { Notification } from "@/services/NotificationService";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NotificationList = ({ 
  notifications, 
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  currentPage,
  totalPages,
  onPageChange 
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
            className={`p-4 flex items-start hover:bg-muted/50 transition-colors ${notification.read ? 'opacity-70' : ''}`}
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
                {notification.read ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => onMarkAsUnread(notification.id)}
                  >
                    Marcar como não lida
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
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
                  onClick={() => onDelete(notification.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
            
            {!notification.read && (
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default NotificationList;
