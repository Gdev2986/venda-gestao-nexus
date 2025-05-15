
import { useCallback, useEffect, useState } from "react";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface UsePartnerClientsOptions {
  partnerId: string | undefined;
  initialPage?: number;
  pageSize?: number;
}

export const usePartnerClients = (options: UsePartnerClientsOptions) => {
  const { partnerId, initialPage = 1, pageSize = 10 } = options;
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  // Fetch clients for the partner
  const fetchClients = useCallback(async () => {
    if (!partnerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: supabaseError, count } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .eq("partner_id", partnerId)
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (supabaseError) {
        throw supabaseError;
      }

      setClients(data || []);
      setTotalPages(count ? Math.ceil(count / pageSize) : 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching partner clients:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching clients"));
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, currentPage, pageSize]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    clients,
    isLoading,
    currentPage,
    totalPages,
    error,
    handlePageChange,
    refreshClients: fetchClients,
  };
};
