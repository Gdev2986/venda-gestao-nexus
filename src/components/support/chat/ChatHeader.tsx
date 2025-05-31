
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  messageCount: number;
  isSubscribed: boolean;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const ChatHeader = ({ messageCount, isSubscribed, onRefresh, isLoading }: ChatHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Chat de Suporte
        <span className="text-sm font-normal text-muted-foreground">
          ({messageCount} mensagens)
        </span>
      </CardTitle>
      
      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <div className="flex items-center gap-1 text-xs">
          {isSubscribed ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-red-500" />
              <span className="text-red-600">Offline</span>
            </>
          )}
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
