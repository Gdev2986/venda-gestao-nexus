import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  created_at: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
}

export function useSupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from("support_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching support tickets:", error);
          setError(error.message);
        } else {
          setTickets(data || []);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching support tickets:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  return { tickets, isLoading, error };
}

