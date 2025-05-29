import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useClientBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientBalance = async () => {
      if (!user) {
        console.log("No user, cannot fetch balance");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch the client balance from the database
        const { data, error } = await supabase
          .from("client_balance")
          .select("balance")
          .eq("client_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching client balance:", error);
          setError(error);
        }

        if (data) {
          setBalance(data.balance);
        } else {
          setBalance(0); // Set default balance to 0 if no data
        }
      } catch (err: any) {
        console.error("Unexpected error fetching client balance:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientBalance();
  }, [user]);

  return { balance, isLoading, error };
};
