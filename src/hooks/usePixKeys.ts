import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types/pix.types";
import { useAuth } from "@/hooks/use-auth";

export function usePixKeys() {
  const { user } = useAuth();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(true);
  const [errorPixKeys, setErrorPixKeys] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPixKeys = async () => {
      if (!user) {
        setIsLoadingPixKeys(false);
        return;
      }

      setIsLoadingPixKeys(true);
      setErrorPixKeys(null);

      try {
        const { data, error } = await supabase
          .from("pix_keys")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          setErrorPixKeys(error);
        } else {
          setPixKeys(data || []);
        }
      } catch (error: any) {
        setErrorPixKeys(error);
      } finally {
        setIsLoadingPixKeys(false);
      }
    };

    fetchPixKeys();
  }, [user]);

  return { pixKeys, isLoadingPixKeys, errorPixKeys };
}
