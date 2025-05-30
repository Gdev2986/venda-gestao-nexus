
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading = false }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const disabled = isSending || isLoading;

  return (
    <div className="border-t p-2 sm:p-3 flex-shrink-0 bg-background">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          className="flex-1 text-sm"
          maxLength={1000}
        />
        
        <Button 
          onClick={handleSendMessage}
          disabled={disabled || !newMessage.trim()}
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
  );
};
