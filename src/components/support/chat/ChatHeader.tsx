
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
  messageCount: number;
  isSubscribed?: boolean;
}

export const ChatHeader = ({ messageCount, isSubscribed = false }: ChatHeaderProps) => {
  return (
    <CardHeader className="pb-2 border-b flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3">
      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Chat de Suporte</span>
        <span className="sm:hidden">Chat</span>
        {messageCount > 0 && (
          <span className="text-xs font-normal text-muted-foreground">
            ({messageCount})
          </span>
        )}
        
        {/* Real-time status indicator */}
        <div className="ml-auto flex items-center gap-1">
          {isSubscribed ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {isSubscribed ? "Online" : "Offline"}
          </span>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
