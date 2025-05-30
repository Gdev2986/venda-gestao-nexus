
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

    // Scroll immediately for new messages
    scrollToBottom();
  }, [messages]);

  // Also scroll on initial load
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "auto",
          block: "end"
        });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [ticketId]);

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
      <div className="h-full flex flex-col min-h-[400px] lg:min-h-[600px]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat de Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-[400px] lg:min-h-[600px]">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 border-b flex-shrink-0">
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="hidden sm:inline">Chat de Suporte</span>
            <span className="sm:hidden">Chat</span>
            {messages.length > 0 && (
              <span className="text-xs lg:text-sm font-normal text-muted-foreground">
                ({messages.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full max-h-[300px] lg:max-h-[400px]">
              <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-center">
                    <MessageSquare className="h-8 w-8 lg:h-12 lg:w-12 text-muted-foreground mb-2 lg:mb-4" />
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Nenhuma mensagem ainda. Inicie a conversa!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[85%] lg:max-w-[80%] ${
                        isMyMessage(message) ? "flex-row-reverse" : ""
                      }`}>
                        <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                          <AvatarFallback className={`text-xs lg:text-sm ${
                            isMyMessage(message) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}>
                            {getUserInitials(message)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`rounded-lg p-2 lg:p-3 shadow-sm ${
                          isMyMessage(message) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <div className="text-xs lg:text-sm">
                            <div className="font-medium mb-1">
                              {getUserDisplayName(message)}
                            </div>
                            <div className="whitespace-pre-wrap break-words">
                              {message.message}
                            </div>
                            <div className={`text-xs mt-1 lg:mt-2 ${
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

          <div className="border-t p-3 lg:p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isSending}
                className="flex-1 text-sm lg:text-base"
                maxLength={1000}
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                size="sm"
                className="px-2 lg:px-3"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-current" />
                ) : (
                  <Send className="h-3 w-3 lg:h-4 lg:w-4" />
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
