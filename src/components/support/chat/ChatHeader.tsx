
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";

interface ChatHeaderProps {
  messageCount: number;
  isSubscribed: boolean;
  onRefresh?: () => void;
  isLoading?: boolean;
  ticket?: SupportTicket;
  assignedUserName?: string;
}

export const ChatHeader = ({ 
  messageCount, 
  isSubscribed, 
  onRefresh, 
  isLoading,
  ticket,
  assignedUserName 
}: ChatHeaderProps) => {
  const { user, userRole } = useAuth();

  const getAttendantInfo = () => {
    if (!ticket) return null;

    if (userRole === 'CLIENT') {
      // Cliente vê "Suporte" se há um técnico atribuído
      return ticket.assigned_to ? (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Atendido por: Suporte</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-xs text-yellow-600">
          <User className="h-3 w-3" />
          <span>Aguardando atendimento</span>
        </div>
      );
    } else {
      // Admin/Logistics vê informações detalhadas
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>
            Cliente: {ticket.client?.business_name || 'Cliente'}
            {ticket.assigned_to && assignedUserName && (
              <> • Técnico: {ticket.assigned_to === user?.id ? 'Você' : assignedUserName}</>
            )}
          </span>
        </div>
      );
    }
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
      <div className="flex flex-col gap-1">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Chat de Suporte
          <span className="text-sm font-normal text-muted-foreground">
            ({messageCount} mensagens)
          </span>
        </CardTitle>
        {getAttendantInfo()}
      </div>
      
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
