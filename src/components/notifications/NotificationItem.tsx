
import * as React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ShoppingCart, 
  CreditCard, 
  Wrench, 
  LifeBuoy, 
  Bell, 
  Trash2, 
  MessageSquare,
  Box,
  TruckIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/notification.types";
import { Notification } from "@/contexts/notifications/types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  // Função para retornar o ícone apropriado baseado no tipo de notificação
  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.SALE:
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case NotificationType.PAYMENT:
        return <CreditCard className="h-4 w-4 text-primary" />;
      case NotificationType.MACHINE:
        return <Box className="h-4 w-4 text-primary" />;
      case NotificationType.SUPPORT:
        return <LifeBuoy className="h-4 w-4 text-primary" />;
      case NotificationType.GENERAL:
        return <Bell className="h-4 w-4 text-primary" />;
      case NotificationType.COMMISSION:
        return <CreditCard className="h-4 w-4 text-primary" />;
      case NotificationType.BALANCE:
        return <CreditCard className="h-4 w-4 text-primary" />;
      case NotificationType.ADMIN_NOTIFICATION:
        return <Bell className="h-4 w-4 text-primary" />;
      case NotificationType.LOGISTICS:
        return <TruckIcon className="h-4 w-4 text-primary" />;
      default:
        return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    onMarkAsRead(notification.id);
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    e.stopPropagation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (onDelete) {
      onDelete(notification.id);
      // Add haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col items-start gap-1 p-4 hover:bg-accent/50 relative border-b border-border last:border-b-0",
        !notification.read ? "" : "opacity-70"
      )}
      onClick={handleMarkAsRead}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          {getIcon(notification.type)}
          <span className="ml-2 font-medium line-clamp-1">{notification.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ptBR
            })}
          </span>
          {onDelete && (
            <Trash2 
              className="h-4 w-4 text-destructive opacity-50 hover:opacity-100 cursor-pointer" 
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
      <span className="text-sm text-muted-foreground line-clamp-2">
        {notification.message}
      </span>
      {!notification.read && (
        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
      )}
    </motion.div>
  );
};
