
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types/payment.types";
import { useAuth } from "@/hooks/use-auth";

export function usePixKeys() {
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPixKeys = async () => {
    if (!user) {
      setPixKeys([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Use the authenticated user's ID directly
      const { data, error } = await supabase
        .from("pix_keys")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        setError(error);
      } else {
        const mappedKeys: PixKey[] = (data || []).map(key => ({
          id: key.id,
          key: key.key,
          type: key.type,
          name: key.name,
          owner_name: key.owner_name || key.name,
          user_id: key.user_id,
          is_default: key.is_default,
          created_at: key.created_at,
          updated_at: key.updated_at
        }));
        setPixKeys(mappedKeys);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPixKeys();
  }, [user]);

  return { 
    pixKeys, 
    isLoading, 
    isLoadingPixKeys: isLoading, // Provide both names for backward compatibility
    error,
    refetch: loadPixKeys
  };
}
