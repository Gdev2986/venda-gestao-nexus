
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getTicketMessages, addMessage } from "@/services/support-request/message-api";
import { getRequestById } from "@/services/support-request/ticket-api";
import { SupportRequestStatus } from "@/types/support-request.types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Send } from "lucide-react"; // Using Lucide icons instead
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  conversation_id?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

interface SupportChatInterfaceProps {
  ticketId?: string;
  clientId?: string;
  isAdmin?: boolean;
}

const SupportChatInterface: React.FC<SupportChatInterfaceProps> = ({ 
  ticketId, 
  clientId, 
  isAdmin = false 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
      ' ' + date.toLocaleDateString();
  };
  
  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Fetch ticket details
  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        try {
          const { data, error } = await getRequestById(ticketId);
          if (error) throw error;
          setTicket(data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os detalhes do ticket",
            variant: "destructive",
          });
        }
      };
      
      fetchTicket();
    }
  }, [ticketId, toast]);
  
  // Fetch messages
  const fetchMessages = async () => {
    if (!ticketId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getTicketMessages(ticketId);
      if (error) throw error;
      
      // Add user information to messages if available
      const messagesWithUserInfo = await Promise.all(
        data.map(async (message) => {
          try {
            // Get user info from profiles
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("name, email, role")
              .eq("id", message.user_id)
              .single();
              
            if (userError) throw userError;
            
            return {
              ...message,
              user: userData
            };
          } catch (error) {
            console.error("Error fetching user info:", error);
            return message;
          }
        })
      );
      
      setMessages(messagesWithUserInfo as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (ticketId) {
      fetchMessages();
    }
  }, [ticketId]);
  
  // Subscribe to message updates
  useEffect(() => {
    if (!ticketId) return;
    
    // Create a real-time subscription
    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${ticketId}`
        },
        (payload) => {
          // Fetch user info for the new message
          const fetchUserAndUpdateMessages = async () => {
            try {
              const { data: userData, error: userError } = await supabase
                .from("profiles")
                .select("name, email, role")
                .eq("id", payload.new.user_id)
                .single();
                
              if (userError) throw userError;
              
              const newMessageWithUser = {
                ...payload.new,
                user: userData
              } as Message;
              
              setMessages(prev => [...prev, newMessageWithUser]);
            } catch (error) {
              console.error("Error fetching user info for real-time message:", error);
              // Make sure we add a complete Message object
              const newMessage = payload.new as Message;
              setMessages(prev => [...prev, newMessage]);
            }
          };
          
          fetchUserAndUpdateMessages();
        }
      )
      .subscribe();
      
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !ticketId) return;
    
    setIsSending(true);
    try {
      const { error } = await addMessage(ticketId, user.id, newMessage);
      if (error) throw error;
      
      setNewMessage("");
      // No need to fetch messages as we will receive the update via real-time subscription
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Show loading state
  if (isLoading && messages.length === 0) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando mensagens...</p>
        </div>
      </Card>
    );
  }
  
  // Show empty state if no ticket is selected
  if (!ticketId) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-muted rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PlusCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum ticket selecionado</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione um ticket para ver e enviar mensagens
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>
            {ticket ? ticket.title : "Carregando..."}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Ticket #{ticketId.substring(0, 8)}
          </div>
        </div>
        {ticket && (
          <div className="flex justify-between items-center mt-1">
            <div className="text-sm text-muted-foreground">
              Cliente: {clientId || ticket.client_id}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium 
              ${ticket.status === SupportRequestStatus.PENDING ? "bg-yellow-100 text-yellow-800" : 
                ticket.status === SupportRequestStatus.IN_PROGRESS ? "bg-blue-100 text-blue-800" : 
                ticket.status === SupportRequestStatus.COMPLETED ? "bg-green-100 text-green-800" : 
                "bg-gray-100 text-gray-800"}
            `}>
              {ticket.status === SupportRequestStatus.PENDING ? "Pendente" : 
                ticket.status === SupportRequestStatus.IN_PROGRESS ? "Em Andamento" : 
                ticket.status === SupportRequestStatus.COMPLETED ? "Concluído" : 
                "Cancelado"}
            </div>
          </div>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="flex-grow overflow-auto py-4">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhuma mensagem encontrada. Seja o primeiro a enviar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = user?.id === message.user_id;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.user?.name ? message.user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                        <div 
                          className={`px-3 py-2 rounded-lg inline-block
                            ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}
                          `}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {message.user?.name || "Usuário"}
                            {message.user?.role && isAdmin && ` (${message.user.role})`}
                          </span>
                          <span>•</span>
                          <span>{formatTimestamp(message.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none"
            rows={2}
            disabled={isSending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="h-auto"
          >
            {isSending ? (
              <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SupportChatInterface;
