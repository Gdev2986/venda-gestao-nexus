
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SupportMessage } from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";
import { ChatHeader } from "./chat/ChatHeader";
import { MessagesList } from "./chat/MessagesList";
import { ChatInput } from "./chat/ChatInput";

interface SupportChatProps {
  ticketId: string;
  messages: SupportMessage[];
  onSendMessage: (message: string, attachments?: any) => Promise<void>;
  isLoading?: boolean;
}

export const SupportChat = ({ 
  ticketId, 
  messages, 
  onSendMessage, 
  isLoading = false 
}: SupportChatProps) => {
  const { user } = useAuth();

  const handleSendMessage = async (message: string) => {
    await onSendMessage(message);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-h-[500px]">
        <Card className="flex-1 flex flex-col">
          <ChatHeader messageCount={0} />
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[500px] w-full">
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatHeader messageCount={messages.length} />
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
          <MessagesList messages={messages} currentUserId={user?.id} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};
