import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest } from "@/types/support.types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface SupportRequestOptions {
  initialFetch?: boolean;
  enableRealtime?: boolean;
}

export const useSupportRequests = (options: SupportRequestOptions = {}) => {
  const { initialFetch = true, enableRealtime = false } = options;
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setRequests(data as SupportRequest[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar solicitações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchRequests();
    }
  }, [initialFetch]);

  useEffect(() => {
    if (enableRealtime) {
      const channel = supabase
        .channel("support_requests")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "support_requests" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              // New request
              setRequests((prevRequests) => [
                payload.new as SupportRequest,
                ...prevRequests,
              ]);
            } else if (payload.eventType === "UPDATE") {
              // Updated request
              setRequests((prevRequests) =>
                prevRequests.map((req) =>
                  req.id === payload.new.id ? (payload.new as SupportRequest) : req
                )
              );
            } else if (payload.eventType === "DELETE") {
              // Deleted request
              setRequests((prevRequests) =>
                prevRequests.filter((req) => req.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [enableRealtime]);

  return {
    requests,
    isLoading,
    fetchRequests,
  };
};
