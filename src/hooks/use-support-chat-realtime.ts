
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
      const messagesWithReadStatus = (data || []).map(msg => {
        // Handle user data more safely
        const userData = msg.user && typeof msg.user === 'object' ? msg.user as any : null;
        
        return {
          ...msg,
          is_read: msg.is_read ?? false,
          user: userData ? {
            name: userData.name || 'Usuário',
            email: userData.email // This might be undefined, which is fine
          } : undefined
        };
      });
      
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
  }, [ticketId, user?.id, isOpen, toast]);

  // Auto-refresh messages after sending
  const refreshMessages = useCallback(async () => {
    console.log('🔄 Refreshing messages for ticket:', ticketId);
    await loadMessages(true);
  }, [loadMessages, ticketId]);

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
          console.log('📩 New message received via realtime:', payload.new);
          
          const newMessage = payload.new as any;
          
          // Add the new message to the state with proper type conversion
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            
            // Handle user data more safely
            const userData = newMessage.user && typeof newMessage.user === 'object' ? newMessage.user as any : null;
            
            const messageWithReadStatus: SupportMessage = {
              ...newMessage,
              is_read: newMessage.is_read ?? false,
              user: userData ? {
                name: userData.name || 'Usuário',
                email: userData.email // This might be undefined, which is fine
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

          // Mark as read if chat is open and auto-refresh
          if (user?.id && isOpen) {
            setTimeout(() => {
              markMessagesAsRead(ticketId, user.id);
              refreshMessages();
            }, 500);
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
  }, [ticketId, isOpen, user?.id, loadMessages, toast, refreshMessages]);

  // Send message function with auto-refresh
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user?.id || !ticketId || isSending) return;

    setIsSending(true);
    try {
      const { data, error } = await sendMessage(ticketId, messageText.trim());
      
      if (error) throw error;

      console.log('✅ Message sent successfully:', data);
      
      // Auto-refresh messages after sending
      setTimeout(() => {
        refreshMessages();
      }, 300);
      
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
  }, [ticketId, user?.id, isSending, toast, refreshMessages]);

  return {
    messages,
    isLoading,
    isSubscribed,
    isSending,
    sendMessage: handleSendMessage,
    refreshMessages
  };
};
