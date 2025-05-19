
import { AnimatePresence } from "framer-motion";
import { Notification } from "@/types/notification.types";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList = ({ notifications, onMarkAsRead }: NotificationListProps) => {
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
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
