import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PixKey, PixKeyType } from "@/types/payment.types";

interface UsePixKeysReturn {
  pixKeys: PixKey[];
  isLoading: boolean;
  isCreating: boolean;
  fetchPixKeys: () => Promise<void>;
  createPixKey: (key: string, type: string, name: string) => Promise<PixKey | null>;
  deletePixKey: (id: string) => Promise<void>;
  setDefaultPixKey: (id: string) => Promise<void>;
}

export function usePixKeys(): UsePixKeysReturn {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPixKeys = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("pix_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) {
        throw error;
      }

      setPixKeys(data || []);
    } catch (error: any) {
      console.error("Error fetching PIX keys:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as chaves PIX. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPixKey = async (key: string, type: string, name: string): Promise<PixKey | null> => {
    if (!user) return null;
    
    try {
      setIsCreating(true);
      
      const pixKeyData = {
        user_id: user.id,
        key,
        type: type as any,
        name,
        is_default: pixKeys.length === 0 // Make default if it's the first key
      };
      
      const { data, error } = await supabase
        .from("pix_keys")
        .insert(pixKeyData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add to local state
      setPixKeys([...pixKeys, data]);
      
      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });
      
      return data;
    } catch (error: any) {
      console.error("Error creating PIX key:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a chave PIX. " + (error.message || ""),
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const deletePixKey = async (id: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setPixKeys(pixKeys.filter((key) => key.id !== id));

      toast({
        title: "Chave PIX removida",
        description: "Sua chave PIX foi removida com sucesso.",
      });
    } catch (error: any) {
      console.error("Error deleting PIX key:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a chave PIX. " + (error.message || ""),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPixKey = async (id: string) => {
    try {
      setIsLoading(true);

      // First, unset all other default keys
      const { error: unsetError } = await supabase
        .from("pix_keys")
        .update({ is_default: false })
        .eq("user_id", user.id);

      if (unsetError) {
        throw unsetError;
      }

      // Then, set the selected key as default
      const { error: setError } = await supabase
        .from("pix_keys")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (setError) {
        throw setError;
      }

      // Update local state
      setPixKeys(
        pixKeys.map((key) => ({
          ...key,
          is_default: key.id === id,
        }))
      );

      toast({
        title: "Chave PIX padrão alterada",
        description: "Sua chave PIX padrão foi alterada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error setting default PIX key:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a chave PIX padrão. " + (error.message || ""),
        variant: "destructive",
      });
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
    isCreating,
    fetchPixKeys,
    createPixKey,
    deletePixKey,
    setDefaultPixKey,
  };
}
