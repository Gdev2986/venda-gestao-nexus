
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

      // Ensure all keys have the required owner_name property
      const formattedKeys: PixKey[] = (data || []).map(item => ({
        id: item.id,
        key: item.key,
        type: item.type,
        name: item.name,
        owner_name: item.name, // Use name as owner_name if not provided
        user_id: item.user_id,
        is_default: item.is_default || false,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setPixKeys(formattedKeys);
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
      
      // Add to local state with owner_name
      const newKey: PixKey = {
        ...data,
        owner_name: name // Ensure owner_name is set
      };
      
      setPixKeys([...pixKeys, newKey]);
      
      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });
      
      return newKey;
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
