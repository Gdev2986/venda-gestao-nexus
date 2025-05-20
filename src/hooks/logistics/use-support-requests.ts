
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestPriority } from "@/types/support-request.types";
import { toast } from "sonner"; // Direct import from sonner
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
      // Fix: Pass the object directly, not as an array
      const { data, error } = await supabase
        .from("support_requests")
        .insert(newRequest)
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
