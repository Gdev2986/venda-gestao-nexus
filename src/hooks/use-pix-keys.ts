
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types/payment.types";

interface UsePixKeysReturn {
  pixKeys: PixKey[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function usePixKeys(): UsePixKeysReturn {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPixKeys = async () => {
    if (!user) {
      setIsLoading(false);
      setPixKeys([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: pixError } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id);

      if (pixError) {
        throw new Error(pixError.message);
      }

      // Transform data to match the PixKey type
      const transformedKeys: PixKey[] = (data || []).map(key => ({
        id: key.id,
        key: key.key,
        type: key.type,
        key_type: key.type, // For compatibility
        user_id: key.user_id,
        name: key.name || '',
        owner_name: key.name || '', // Use name as owner_name
        isDefault: key.is_default || false,
        is_active: true, // Default to true
        bank_name: 'Default Bank' // Provide default value
      }));

      setPixKeys(transformedKeys);
    } catch (err: any) {
      console.error('Error fetching PIX keys:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPixKeys();
  }, [user]);

  return {
    pixKeys,
    isLoading,
    error,
    mutate: fetchPixKeys
  };
}
