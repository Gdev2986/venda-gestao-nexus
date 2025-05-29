
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types/pix.types";
import { useAuth } from "@/hooks/use-auth";

export function usePixKeys() {
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPixKeys = async () => {
      if (!user) {
        setPixKeys([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("pix_keys")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          setError(error);
        } else {
          setPixKeys(data || []);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPixKeys();
  }, [user]);

  return { 
    pixKeys, 
    isLoading, 
    isLoadingPixKeys: isLoading, // Provide both names for backward compatibility
    error 
  };
}
