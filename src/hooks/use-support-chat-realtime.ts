
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "@/types/support.types"; // Use consistent types
import { getMessages, sendMessage, markMessagesAsRead } from "@/services/support/message-api";

interface UseSupportChatRealtimeProps {
  ticketId: string;
  isOpen: boolean;
}

export const useSupportChatRealtime = ({ ticketId, isOpen }: UseSupportChatRealtimeProps) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  // Load initial messages
  const loadMessages = useCallback(async (forceReload = false) => {
    if (!ticketId || (!forceReload && messages.length > 0)) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getMessages(ticketId);
      if (error) throw error;
      
      // Ensure all messages have is_read property and compatible user data
      const messagesWithReadStatus = (data || []).map(msg => ({
        ...msg,
        is_read: msg.is_read ?? false,
        user: msg.user ? {
          name: msg.user.name || 'Usuário',
          email: msg.user.email || undefined
        } : undefined
      }));
      
      setMessages(messagesWithReadStatus);
      
      // Mark messages as read if user is viewing the chat
      if (user?.id && isOpen) {
        await markMessagesAsRead(ticketId, user.id);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, user?.id, isOpen, messages.length, toast]);

  // Setup realtime subscription
  useEffect(() => {
    if (!ticketId || !isOpen) return;

    console.log('🔔 Setting up realtime subscription for ticket:', ticketId);

    // Create channel for this specific ticket
    const channel = supabase
      .channel(`support-chat-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${ticketId}`
        },
        (payload) => {
          console.log('📩 New message received:', payload.new);
          
          const newMessage = payload.new as any;
          
          // Add the new message to the state with proper type conversion
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            
            const messageWithReadStatus: SupportMessage = {
              ...newMessage,
              is_read: newMessage.is_read ?? false,
              user: newMessage.user ? {
                name: newMessage.user.name || 'Usuário',
                email: newMessage.user.email || undefined
              } : undefined
            };
            
            return [...prev, messageWithReadStatus];
          });

          // Show notification if message is from someone else
          if (newMessage.user_id !== user?.id) {
            toast({
              title: "Nova mensagem",
              description: "Você recebeu uma nova mensagem no chat",
            });
          }

          // Mark as read if chat is open
          if (user?.id && isOpen) {
            markMessagesAsRead(ticketId, user.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    // Load initial messages
    loadMessages();

    return () => {
      console.log('🔌 Cleaning up subscription for ticket:', ticketId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsSubscribed(false);
    };
  }, [ticketId, isOpen, user?.id, loadMessages, toast]);

  // Send message function
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user?.id || !ticketId || isSending) return;

    setIsSending(true);
    try {
      const { data, error } = await sendMessage(ticketId, user.id, messageText.trim());
      
      if (error) throw error;

      console.log('✅ Message sent successfully:', data);
      
      // Note: The message will be added to state via realtime subscription
      // so we don't need to manually add it here
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [ticketId, user?.id, isSending, toast]);

  // Refresh messages manually
  const refreshMessages = useCallback(() => {
    loadMessages(true);
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    isSubscribed,
    isSending,
    sendMessage: handleSendMessage,
    refreshMessages
  };
};
