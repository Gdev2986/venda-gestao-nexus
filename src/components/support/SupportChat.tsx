
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import { SupportMessage } from "@/types/support.types";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/utils/format";

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
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);
    
    try {
      await onSendMessage(messageText);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message on error
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isMyMessage = (message: SupportMessage) => {
    return message.user_id === user?.id;
  };

  const getUserInitials = (message: SupportMessage) => {
    if (message.user?.name) {
      return message.user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = (message: SupportMessage) => {
    return message.user?.name || "Usuário";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-h-[500px]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat de Suporte
            </CardTitle>
          </CardHeader>
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
        <CardHeader className="pb-2 border-b flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat de Suporte</span>
            <span className="sm:hidden">Chat</span>
            {messages.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({messages.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2 sm:p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma mensagem ainda. Inicie a conversa!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-[75%] ${
                        isMyMessage(message) ? "flex-row-reverse" : ""
                      }`}>
                        <Avatar className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0">
                          <AvatarFallback className={`text-xs ${
                            isMyMessage(message) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}>
                            {getUserInitials(message)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`rounded-lg p-2 sm:p-3 shadow-sm max-w-full ${
                          isMyMessage(message) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <div className="text-xs sm:text-sm">
                            <div className="font-medium mb-1 text-xs">
                              {getUserDisplayName(message)}
                            </div>
                            <div className="whitespace-pre-wrap break-words text-xs sm:text-sm">
                              {message.message}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isMyMessage(message) 
                                ? "text-primary-foreground/70" 
                                : "text-muted-foreground"
                            }`}>
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t p-2 sm:p-3 flex-shrink-0 bg-background">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isSending}
                className="flex-1 text-sm"
                maxLength={1000}
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                size="sm"
                className="px-2 sm:px-3 flex-shrink-0"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                ) : (
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
            
            {newMessage.length > 900 && (
              <div className="text-xs text-muted-foreground mt-1">
                {1000 - newMessage.length} caracteres restantes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
