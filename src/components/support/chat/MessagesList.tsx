
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format";
import { SupportMessage } from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";

interface MessagesListProps {
  messages: SupportMessage[];
  currentUserId?: string;
  clientName?: string;
}

export const MessagesList = ({ messages, currentUserId, clientName }: MessagesListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { userRole } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getDisplayName = (message: SupportMessage, isOwnMessage: boolean) => {
    if (isOwnMessage) {
      return 'Você';
    }

    if (userRole === 'CLIENT') {
      // Cliente sempre vê "Suporte" para mensagens de admin/logistics
      return 'Suporte';
    } else {
      // Admin/Logistics vê o nome do cliente ou o nome real do usuário
      if (message.user?.name) {
        return message.user.name;
      }
      return clientName || 'Cliente';
    }
  };

  const getAvatarInitials = (message: SupportMessage, isOwnMessage: boolean) => {
    if (isOwnMessage) {
      return 'EU';
    }

    if (userRole === 'CLIENT') {
      return 'SUP'; // Suporte
    } else {
      // Admin/Logistics
      if (message.user?.name) {
        return message.user.name.charAt(0).toUpperCase();
      }
      return clientName ? clientName.charAt(0).toUpperCase() : 'C';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>Nenhuma mensagem ainda.</p>
          <p className="text-sm">Inicie a conversa enviando uma mensagem!</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="space-y-4 py-4">
        {messages.map((message) => {
          const isOwnMessage = message.user_id === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {getAvatarInitials(message, isOwnMessage)}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {getDisplayName(message, isOwnMessage)}
                  </span>
                  <span>{formatDate(message.created_at)}</span>
                </div>
                
                <div
                  className={`rounded-lg px-3 py-2 text-sm break-words ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
