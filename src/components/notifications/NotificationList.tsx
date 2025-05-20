
import { AnimatePresence } from "framer-motion";
import { Notification } from "@/types/notification.types";
import { NotificationItem } from "./NotificationItem";
import { Spinner } from "@/components/ui/spinner";
import { 
  DropdownMenuGroup, 
  DropdownMenu,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  isLoading = false, 
  onDelete 
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
      <AnimatePresence>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          notifications.map((notification: Notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
