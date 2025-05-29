
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip } from "lucide-react";
import { SupportTicket, SupportMessage, CreateMessageParams } from "@/types/support.types";
import { useSupportMessages } from "@/hooks/use-support-messages";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SupportChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

export const SupportChatDialog: React.FC<SupportChatDialogProps> = ({
  isOpen,
  onOpenChange,
  ticket
}) => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useSupportMessages(ticket?.id);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    if (!ticket) return;

    setIsSending(true);

    const params: CreateMessageParams = {
      conversation_id: ticket.id,
      message: newMessage.trim()
    };

    const success = await sendMessage(params);
    
    if (success) {
      setNewMessage("");
    }
    
    setIsSending(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELED': return 'Cancelado';
      default: return status;
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{ticket.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(ticket.status)}>
                  {getStatusText(ticket.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Criado em {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-4 border rounded-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Initial ticket description */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{ticket.client?.contact_name?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{ticket.client?.contact_name || 'Cliente'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{ticket.description}</p>
                </div>

                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${
                    message.user_id === user?.id ? 'flex-row-reverse' : ''
                  }`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.user?.name?.[0] || message.user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[70%] ${
                      message.user_id === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } p-3 rounded-lg`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {message.user?.name || message.user?.email || 'Usuário'}
                        </p>
                        <p className="text-xs opacity-70">
                          {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {ticket.status !== 'COMPLETED' && ticket.status !== 'CANCELED' && (
            <div className="mt-4 p-4 border rounded-lg">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSending || !newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
