
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SupportMessage, CreateMessageParams } from "@/types/support.types";
import { useToast } from "@/hooks/use-toast";

export function useSupportMessages(ticketId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!ticketId || !user) return;

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
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages: SupportMessage[] = (data || []).map(item => ({
        id: item.id,
        ticket_id: item.ticket_id,
        user_id: item.user_id,
        message: item.message,
        attachments: item.attachments || [],
        is_read: item.is_read,
        created_at: item.created_at,
        user: item.user
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
      // Upload attachments if any
      let attachments = [];
      if (params.attachments && params.attachments.length > 0) {
        for (const file of params.attachments) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("support-attachments")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("support-attachments")
            .getPublicUrl(fileName);

          attachments.push({
            id: fileName,
            name: file.name,
            url: publicUrl,
            type: file.type,
            size: file.size
          });
        }
      }

      const { error } = await supabase
        .from("support_messages")
        .insert({
          ticket_id: params.ticket_id,
          user_id: user.id,
          message: params.message,
          attachments: attachments
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
    if (!ticketId || !user) return;

    try {
      await supabase
        .from("support_messages")
        .update({ is_read: true })
        .eq("ticket_id", ticketId)
        .neq("user_id", user.id);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchMessages();

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`support_messages_${ticketId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_messages',
            filter: `ticket_id=eq.${ticketId}`
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
  }, [ticketId, user]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
}
