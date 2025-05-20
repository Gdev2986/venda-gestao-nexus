
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestPriority } from "@/types/support-request.types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useSupportRequests() {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSupportRequests();
    }
  }, [user]);

  const fetchSupportRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_requests")
        .select("*")
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching support requests:", error);
        toast("Erro: Não foi possível carregar as solicitações");
      } else {
        // Ensure we're handling the data correctly
        setSupportRequests(data as SupportRequest[] || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching support requests:", error);
      toast("Erro: " + (error.message || "Erro inesperado ao carregar as solicitações"));
    } finally {
      setIsLoading(false);
    }
  };

  const createSupportRequest = async (newRequest: Omit<SupportRequest, 'id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      // Convert the enum types explicitly to string literals
      const insertData = {
        client_id: newRequest.client_id,
        technician_id: newRequest.technician_id,
        type: newRequest.type as unknown as "MAINTENANCE" | "INSTALLATION" | "REPAIR" | "TRAINING" | "SUPPORT" | "OTHER",
        status: newRequest.status as unknown as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
        priority: newRequest.priority as unknown as "LOW" | "MEDIUM" | "HIGH",
        title: newRequest.title,
        description: newRequest.description,
        scheduled_date: newRequest.scheduled_date,
        resolution: newRequest.resolution
      };

      const { data, error } = await supabase
        .from("support_requests")
        .insert(insertData)
        .select();

      if (error) {
        console.error("Error creating support request:", error);
        toast("Erro: Não foi possível criar a solicitação de suporte");
      } else {
        setSupportRequests(prevRequests => [...prevRequests, ...(data as SupportRequest[])]);
        toast("Sucesso: Solicitação de suporte criada com sucesso!");
      }
    } catch (error: any) {
      console.error("Unexpected error creating support request:", error);
      toast("Erro: " + (error.message || "Erro inesperado ao criar a solicitação de suporte"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    supportRequests,
    isLoading,
    fetchSupportRequests,
    createSupportRequest,
  };
}
