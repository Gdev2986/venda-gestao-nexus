
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, CreditCard, Wrench, LifeBuoy, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notification.types";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  // Função para retornar o ícone apropriado baseado no tipo de notificação
  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.SALE:
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case NotificationType.PAYMENT:
        return <CreditCard className="h-4 w-4 text-primary" />;
      case NotificationType.MACHINE:
        return <Wrench className="h-4 w-4 text-primary" />;
      case NotificationType.SUPPORT:
        return <LifeBuoy className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <DropdownMenuItem
        className={cn(
          "flex flex-col items-start gap-1 p-4 focus:bg-accent/50",
          notification.is_read ? "opacity-70" : ""
        )}
        onClick={() => {
          onMarkAsRead(notification.id);
          // Add haptic feedback for mobile devices
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }}
      >
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            {getIcon(notification.type)}
            <span className="ml-2 font-medium line-clamp-1">{notification.title}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </span>
        </div>
        <span className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </span>
        {!notification.is_read && (
          <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
        )}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </motion.div>
  );
};
