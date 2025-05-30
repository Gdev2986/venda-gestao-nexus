
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { SupportMessage } from "@/types/support.types";
import { MessageItem } from "./MessageItem";

interface MessagesListProps {
  messages: SupportMessage[];
  currentUserId?: string;
}

export const MessagesList = ({ messages, currentUserId }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "end"
        });
      }
    };

    // Add a small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const isMyMessage = (message: SupportMessage) => {
    return message.user_id === currentUserId;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 sm:p-3">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma mensagem ainda. Inicie a conversa!
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-2 sm:p-3 space-y-3">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isMyMessage={isMyMessage(message)}
              currentUserId={currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
