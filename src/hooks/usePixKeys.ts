
import { useState, useEffect } from "react";
import { PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const usePixKeys = () => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPixKeys = async () => {
      if (!user) {
        setIsLoadingPixKeys(false);
        return;
      }

      setIsLoadingPixKeys(true);
      try {
        const { data, error } = await supabase
          .from('pix_keys')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // Format the PIX keys to match the expected PixKey interface
        const formattedKeys: PixKey[] = data?.map(key => ({
          id: key.id,
          key: key.key,
          type: key.type,
          key_type: key.type,
          name: key.name,
          owner_name: key.name, // Use name as owner_name
          user_id: key.user_id,
          is_active: true, // Providing default values for required properties
          bank_name: "Default Bank", // Providing default value
          created_at: key.created_at,
          updated_at: key.updated_at,
          isDefault: key.is_default
        })) || [];

        setPixKeys(formattedKeys);
        
        // If no PIX keys, add a mocked one for testing
        if (formattedKeys.length === 0) {
          console.log("No PIX keys found for user", user.id);
          
          // Adding a mocked PIX key if none are registered
          setPixKeys([
            {
              id: "default-key",
              key: "example@email.com",
              type: "EMAIL",
              key_type: "EMAIL",
              name: "Chave Principal",
              owner_name: "Chave Principal",
              user_id: user.id,
              is_active: true,
              bank_name: "Default Bank",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              isDefault: true
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching PIX keys:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar chaves PIX",
          description: "Não foi possível carregar suas chaves PIX",
        });
        
        // Add a mocked PIX key in case of error
        setPixKeys([
          {
            id: "default-key",
            key: "example@email.com",
            type: "EMAIL",
            key_type: "EMAIL",
            name: "Chave Principal",
            owner_name: "Chave Principal",
            user_id: user ? user.id : "",
            is_active: true,
            bank_name: "Default Bank",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isDefault: true
          }
        ]);
      } finally {
        setIsLoadingPixKeys(false);
      }
    };

    fetchPixKeys();
  }, [user, toast]);

  return { pixKeys, isLoadingPixKeys };
};
