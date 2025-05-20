import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest } from "@/types/support-request";
import { toast } from "@/hooks/use-toast"; // Corrected import
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
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching support requests:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as solicitações",
        });
      } else {
        setSupportRequests(data || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching support requests:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao carregar as solicitações",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSupportRequest = async (newRequest: Omit<SupportRequest, 'id' | 'created_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_requests")
        .insert([newRequest])
        .select();

      if (error) {
        console.error("Error creating support request:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a solicitação de suporte",
        });
      } else {
        setSupportRequests(prevRequests => [...prevRequests, ...(data as SupportRequest[])]);
        toast({
          title: "Sucesso",
          description: "Solicitação de suporte criada com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error creating support request:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao criar a solicitação de suporte",
      });
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
