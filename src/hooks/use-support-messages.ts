
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SupportMessage, CreateMessageParams } from "@/types/support.types";
import { useToast } from "@/hooks/use-toast";

export function useSupportMessages(conversationId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!conversationId || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select(`
          *,
          user:profiles!user_id (
            id,
            name,
            role,
            email
          )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages: SupportMessage[] = (data || []).map(item => ({
        id: item.id,
        conversation_id: item.conversation_id,
        user_id: item.user_id,
        message: item.message,
        is_read: item.is_read,
        created_at: item.created_at,
        user: Array.isArray(item.user) && item.user.length > 0 ? item.user[0] : item.user
      }));

      setMessages(formattedMessages);

      // Mark messages as read
      await markMessagesAsRead();
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError(err.message || "Erro ao carregar mensagens");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (params: CreateMessageParams): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("support_messages")
        .insert({
          conversation_id: params.conversation_id,
          user_id: user.id,
          message: params.message
        });

      if (error) throw error;

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso"
      });

      return true;
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Erro ao enviar mensagem"
      });
      return false;
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId || !user) return;

    try {
      await supabase
        .from("support_messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`support_messages_${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, user]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
}
