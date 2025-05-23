
import { AnimatePresence, motion } from "framer-motion";
import { Notification } from "@/types/notification.types";
import { NotificationItem } from "./NotificationItem";
import { Spinner } from "@/components/ui/spinner";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

// Export both as named and default export to ensure compatibility
export const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead, 
  isLoading = false, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
      <AnimatePresence initial={false}>
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 text-center text-muted-foreground"
          >
            Nenhuma notificação
          </motion.div>
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

// Also export as default
export default NotificationList;
