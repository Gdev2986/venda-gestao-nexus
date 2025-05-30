
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  // Also scroll on initial load
  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "auto",
          block: "end"
        });
      }
    }, 100);
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
      <Card className="h-96 flex flex-col">
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
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat de Suporte
          {messages.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({messages.length} mensagens)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    isMyMessage(message) ? "flex-row-reverse" : ""
                  }`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={
                        isMyMessage(message) 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }>
                        {getUserInitials(message)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-lg p-3 ${
                      isMyMessage(message) 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}>
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {getUserDisplayName(message)}
                        </div>
                        <div className="whitespace-pre-wrap break-words">
                          {message.message}
                        </div>
                        <div className={`text-xs mt-2 ${
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

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isSending}
              className="flex-1"
              maxLength={1000}
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              size="sm"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : (
                <Send className="h-4 w-4" />
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
  );
};
