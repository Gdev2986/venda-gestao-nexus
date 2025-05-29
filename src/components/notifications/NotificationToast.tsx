
import { NotificationType } from "@/types/notification.types";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  Package, 
  CreditCard, 
  LifeBuoy, 
  Truck,
  AlertCircle
} from "lucide-react";

interface NotificationToastProps {
  title: string;
  message: string;
  type: NotificationType;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.PAYMENT:
    case NotificationType.PAYMENT_APPROVED:
    case NotificationType.PAYMENT_REJECTED:
    case NotificationType.PAYMENT_REQUEST:
      return <CreditCard className="h-4 w-4" />;
    case NotificationType.SUPPORT:
      return <LifeBuoy className="h-4 w-4" />;
    case NotificationType.LOGISTICS:
      return <Truck className="h-4 w-4" />;
    case NotificationType.MACHINE:
      return <Package className="h-4 w-4" />;
    case NotificationType.SYSTEM:
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export const showNotificationToast = ({ title, message, type }: NotificationToastProps) => {
  const icon = getNotificationIcon(type);
  
  toast({
    title: (
      <div className="flex items-center gap-2">
        {icon}
        {title}
      </div>
    ) as any,
    description: message,
    duration: 5000,
  });

  // Also show browser notification if permission is granted
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        tag: `notification-${Date.now()}`,
      });
    } catch (error) {
      console.warn("Could not show browser notification:", error);
    }
  }
};
