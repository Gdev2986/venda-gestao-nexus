
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface NotificationHeaderProps {
  unreadCount: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  markAllAsRead: () => void;
}

export const NotificationHeader = ({
  unreadCount,
  soundEnabled,
  toggleSound,
  markAllAsRead
}: NotificationHeaderProps) => {
  return (
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
  );
};
