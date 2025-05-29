
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SupportTicket, SupportRequestStatus, CreateSupportTicketParams } from "@/types/support.types";
import { useToast } from "@/hooks/use-toast";

export function useSupportTickets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get user's client_id first
      const { data: userAccess } = await supabase
        .from("user_client_access")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (!userAccess?.client_id) {
        setTickets([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("support_requests")
        .select(`
          *,
          client:clients!client_id (
            id,
            business_name,
            contact_name,
            phone,
            email
          )
        `)
        .eq("client_id", userAccess.client_id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTickets: SupportTicket[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        technician_id: item.technician_id,
        type: item.type,
        status: item.status,
        priority: item.priority,
        scheduled_date: item.scheduled_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        title: item.title,
        description: item.description,
        resolution: item.resolution,
        client: Array.isArray(item.client) && item.client.length > 0 ? item.client[0] : item.client
      }));

      setTickets(formattedTickets);
    } catch (err: any) {
      console.error("Error fetching support tickets:", err);
      setError(err.message || "Erro ao carregar chamados");
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (params: CreateSupportTicketParams): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("support_requests")
        .insert({
          title: params.title,
          description: params.description,
          type: params.type,
          priority: params.priority,
          client_id: params.client_id,
          status: SupportRequestStatus.PENDING
        });

      if (error) throw error;

      toast({
        title: "Chamado criado",
        description: "Seu chamado foi criado com sucesso"
      });

      fetchTickets();
      return true;
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Erro ao criar chamado"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('client_support_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_requests'
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    tickets,
    isLoading,
    error,
    createTicket,
    refetch: fetchTickets
  };
}
