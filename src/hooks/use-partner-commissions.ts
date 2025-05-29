import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface PartnerCommission {
  id: string;
  partner_id: string;
  month: string;
  year: string;
  total_sales: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
}

export function usePartnerCommissions() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<PartnerCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("partner_commissions")
          .select("*")
          .eq("partner_id", user.id)
          .order("year", { ascending: false })
          .order("month", { ascending: false });

        if (error) {
          setError(error);
        } else {
          setCommissions(data || []);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  return { commissions, isLoading, error };
}

