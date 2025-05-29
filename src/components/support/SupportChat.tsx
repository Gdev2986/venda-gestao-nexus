
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface SupportChatProps {
  ticketId: string;
}

export const SupportChat = ({ ticketId }: SupportChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user.email || "Usuário",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-96">
      <ScrollArea className="flex-1 p-4 border rounded-t">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="font-semibold">{message.sender}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(message.timestamp).toLocaleString()}
            </div>
            <div className="mt-1">{message.content}</div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex gap-2 p-2 border-x border-b rounded-b">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Enviar</Button>
      </div>
    </div>
  );
};
