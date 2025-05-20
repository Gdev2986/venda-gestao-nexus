
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/contexts/notifications/NotificationsProvider";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationList } from "@/components/notifications/NotificationList"; // Using named import
import { NotificationFooter } from "@/components/notifications/NotificationFooter";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    soundEnabled,
    setSoundEnabled
  } = useNotifications();

  // Pega apenas as 5 notificações mais recentes para exibir no dropdown
  const recentNotifications = notifications.slice(0, 5);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[calc(100vw-1rem)] sm:w-80" 
          sideOffset={5}
        >
          <NotificationHeader 
            unreadCount={unreadCount}
            soundEnabled={soundEnabled}
            toggleSound={() => setSoundEnabled(!soundEnabled)}
            markAllAsRead={markAllAsRead}
          />
          <DropdownMenuSeparator />
          <NotificationList 
            notifications={recentNotifications}
            onMarkAsRead={markAsRead}
          />
          <NotificationFooter onClose={() => setIsOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NotificationDropdown;
