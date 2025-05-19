
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
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
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart, CreditCard, Wrench, LifeBuoy } from "lucide-react";
import { Notification, NotificationType } from "@/types/notification.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
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
          className="w-[calc(100vw-1rem)] sm:w-80" 
          sideOffset={5}
        >
          <div className="flex items-center justify-between p-4">
            <DropdownMenuLabel className="font-normal">
              Notificações
            </DropdownMenuLabel>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleSound}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {soundEnabled ? "Desativar sons" : "Ativar sons"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs"
                  onClick={() => {
                    markAllAsRead();
                    // Add haptic feedback for mobile devices
                    if (navigator.vibrate) {
                      navigator.vibrate(100);
                    }
                  }}
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
            <AnimatePresence>
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                recentNotifications.map((notification: Notification) => (
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
                        markAsRead(notification.id);
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
              onClick={() => setIsOpen(false)}
            >
              <Link to="/notifications">Ver todas notificações</Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NotificationDropdown;
