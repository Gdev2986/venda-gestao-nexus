
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSupportChatRealtime } from "@/hooks/use-support-chat-realtime";
import { ChatHeader } from "./chat/ChatHeader";
import { MessagesList } from "./chat/MessagesList";
import { ChatInput } from "./chat/ChatInput";
import { useAuth } from "@/hooks/use-auth";

interface SupportChatProps {
  ticketId: string;
  messages?: any[]; // Legacy prop - now managed internally
  onSendMessage?: (message: string, attachments?: any) => Promise<void>; // Legacy prop
  isLoading?: boolean;
  isSubscribed?: boolean; // Legacy prop - now managed internally
}

export const SupportChat = ({ 
  ticketId, 
  isLoading: legacyLoading = false
}: SupportChatProps) => {
  const { user } = useAuth();
  
  const {
    messages,
    isLoading,
    isSubscribed,
    isSending,
    sendMessage,
    refreshMessages
  } = useSupportChatRealtime({
    ticketId,
    isOpen: true
  });

  const actualLoading = legacyLoading || isLoading;

  if (actualLoading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full max-h-[400px] min-h-[300px] w-full">
        <Card className="flex-1 flex flex-col h-full">
          <ChatHeader 
            messageCount={0} 
            isSubscribed={false} 
            onRefresh={refreshMessages}
            isLoading={true}
          />
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[400px] min-h-[300px] w-full overflow-hidden">
      <Card className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader 
          messageCount={messages.length} 
          isSubscribed={isSubscribed}
          onRefresh={refreshMessages}
          isLoading={isLoading}
        />
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
          <MessagesList 
            messages={messages} 
            currentUserId={user?.id} 
          />
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isSending}
            disabled={!isSubscribed}
          />
        </CardContent>
      </Card>
    </div>
  );
};
