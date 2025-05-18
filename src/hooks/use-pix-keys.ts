
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types/payment.types";

export const usePixKeys = () => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPixKeys = async () => {
    if (!user) {
      setIsLoadingPixKeys(false);
      return;
    }

    try {
      setIsLoadingPixKeys(true);
      
      const { data, error } = await supabase
        .from("pix_keys")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        throw error;
      }
      
      const formattedPixKeys: PixKey[] = data.map(key => ({
        id: key.id,
        key: key.key,
        type: key.type,
        name: key.name,
        owner_name: key.name, // Use name as owner_name since it doesn't exist in table
        is_default: key.is_default,
        user_id: key.user_id,
        created_at: key.created_at,
        updated_at: key.updated_at,
        bank_name: "Banco" // Default value as it doesn't exist in table
      }));
      
      setPixKeys(formattedPixKeys);
    } catch (error: any) {
      console.error("Error fetching PIX keys:", error);
      toast({
        title: "Erro ao carregar chaves PIX",
        description: "Não foi possível carregar suas chaves PIX. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPixKeys(false);
    }
  };

  const addPixKey = async (keyData: {
    type: string;
    key: string;
    name: string;
  }): Promise<void> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar uma chave PIX.",
        variant: "destructive",
      });
      return Promise.reject("User not authenticated");
    }

    try {
      const { error } = await supabase
        .from("pix_keys")
        .insert({
          user_id: user.id,
          type: keyData.type,
          key: keyData.key,
          name: keyData.name,
          is_default: pixKeys.length === 0 // Set as default if it's the first key
        });

      if (error) throw error;
      
      // Refresh the list of PIX keys
      await fetchPixKeys();
      
      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding PIX key:", error);
      toast({
        title: "Erro ao adicionar chave PIX",
        description: "Não foi possível adicionar a chave PIX. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const setDefaultPixKey = async (keyId: string): Promise<void> => {
    if (!user) return;

    try {
      // First, set all keys to not default
      await supabase
        .from("pix_keys")
        .update({ is_default: false })
        .eq("user_id", user.id);
      
      // Then set the selected key as default
      await supabase
        .from("pix_keys")
        .update({ is_default: true })
        .eq("id", keyId);
      
      // Refresh the list
      await fetchPixKeys();
      
      toast({
        title: "Chave padrão atualizada",
        description: "Sua chave PIX padrão foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error setting default PIX key:", error);
      toast({
        title: "Erro ao definir chave padrão",
        description: "Não foi possível definir a chave PIX como padrão.",
        variant: "destructive",
      });
    }
  };

  const deletePixKey = async (keyId: string): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", keyId)
        .eq("user_id", user.id); // Extra safety check
      
      if (error) throw error;
      
      // Refresh the list
      await fetchPixKeys();
      
      toast({
        title: "Chave PIX removida",
        description: "Sua chave PIX foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting PIX key:", error);
      toast({
        title: "Erro ao remover chave PIX",
        description: "Não foi possível remover a chave PIX.",
        variant: "destructive",
      });
    }
  };

  // Load PIX keys on component mount
  useEffect(() => {
    fetchPixKeys();
  }, [user]);

  return {
    pixKeys,
    isLoadingPixKeys,
    fetchPixKeys,
    addPixKey,
    setDefaultPixKey,
    deletePixKey,
  };
};
