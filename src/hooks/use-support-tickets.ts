
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SupportTicket, SupportRequestStatus, SupportRequestType, SupportRequestPriority, CreateSupportTicketParams } from "@/types/support.types";
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
          ),
          machine:machines!machine_id (
            id,
            serial_number,
            model
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTickets: SupportTicket[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        technician_id: item.technician_id,
        machine_id: item.machine_id,
        assigned_to: item.assigned_to,
        type: item.type as SupportRequestType,
        status: item.status as SupportRequestStatus,
        priority: item.priority as SupportRequestPriority,
        scheduled_date: item.scheduled_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        title: item.title,
        description: item.description,
        resolution: item.resolution,
        attachments: item.attachments || [],
        client: item.client,
        machine: item.machine
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
      // Get client ID for the current user
      const { data: clientData } = await supabase
        .from("user_client_access")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (!clientData) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível identificar o cliente"
        });
        return false;
      }

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
        .from("support_requests")
        .insert({
          client_id: clientData.client_id,
          title: params.title,
          description: params.description,
          type: params.type,
          priority: params.priority,
          machine_id: params.machine_id,
          status: SupportRequestStatus.PENDING,
          attachments: attachments
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso"
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
      .channel('support_requests_changes')
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
