
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead
  } = useNotifications({
    page: 1,
    pageSize: 10,
    statusFilter: "all"
  });

  const formatTimestamp = (date: string) => {
    try {
      // Parse the ISO string to a Date object
      const parsedDate = parseISO(date);
      return formatDistanceToNow(parsedDate, { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      console.error("Error parsing date:", error);
      return date; // Return original string if parsing fails
    }
  };

  // Close dropdown when clicking outside
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
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (user && markAllAsRead) {
      markAllAsRead();
    }
  };

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
          className="w-80"
          sideOffset={5}
        >
          <div className="flex items-center justify-between p-4">
            <DropdownMenuLabel className="font-normal">
              Notificações
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
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
                        notification.read ? "opacity-70" : ""
                      )}
                      onClick={() => notification.id && markAsRead(notification.id)}
                    >
                      <div className="flex w-full justify-between">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.created_at)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {notification.message}
                      </span>
                      {!notification.read && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className="p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              asChild
            >
              <Link to="/notifications">Ver todas notificações</Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationDropdown;
