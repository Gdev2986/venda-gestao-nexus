
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getMockPixKeys } from "@/utils/mock-payment-data";

export const usePixKeys = () => {
  const { toast } = useToast();
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(false);

  useEffect(() => {
    const fetchPixKeys = async () => {
      setIsLoadingPixKeys(true);
      
      try {
        const { data, error } = await supabase
          .from('pix_keys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedKeys = (data || []).map(key => ({
          id: key.id,
          user_id: key.user_id,
          key_type: key.type,
          type: key.type,
          key: key.key,
          owner_name: key.name,
          name: key.name,
          isDefault: key.is_default,
          is_active: true,
          created_at: key.created_at,
          updated_at: key.updated_at,
          bank_name: "Banco"
        }));
        
        setPixKeys(formattedKeys);
      } catch (err) {
        console.error('Error fetching PIX keys:', err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar chaves PIX",
          description: "Não foi possível carregar suas chaves PIX."
        });

        // Use mock data as fallback
        setPixKeys(getMockPixKeys());
      } finally {
        setIsLoadingPixKeys(false);
      }
    };
    
    fetchPixKeys();
  }, [toast]);

  return { pixKeys, isLoadingPixKeys };
};
