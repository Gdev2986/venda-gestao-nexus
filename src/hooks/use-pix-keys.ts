
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PixKey } from "@/types/payment.types";
import { useToast } from "./use-toast";

export function usePixKeys() {
  const [keys, setKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchKeys = async () => {
    if (!user) {
      setKeys([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("pix_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
        
      if (error) throw error;
      
      // Convert DB data to PixKey type
      const pixKeys: PixKey[] = data.map(key => ({
        id: key.id,
        key: key.key,
        type: key.type,
        name: key.name,
        owner_name: key.owner_name || '',
        is_default: key.is_default,
        user_id: key.user_id,
        created_at: key.created_at,
        updated_at: key.updated_at,
        bank_name: key.bank_name
      }));
      
      setKeys(pixKeys);
    } catch (err: any) {
      setError(err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar chaves PIX",
        description: err.message || "Não foi possível carregar suas chaves PIX"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchKeys();
    
    // Set up real-time subscription for PIX key changes
    if (user) {
      const channel = supabase
        .channel('pix-keys-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pix_keys',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchKeys();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const setDefaultKey = async (keyId: string) => {
    if (!user) return;
    
    try {
      // First, unset all defaults
      const { error: error1 } = await supabase
        .from("pix_keys")
        .update({ is_default: false })
        .eq("user_id", user.id);
      
      if (error1) throw error1;
      
      // Then set this one as default
      const { error: error2 } = await supabase
        .from("pix_keys")
        .update({ is_default: true })
        .eq("id", keyId)
        .eq("user_id", user.id);
        
      if (error2) throw error2;
      
      toast({
        title: "Chave padrão atualizada",
        description: "A chave PIX padrão foi atualizada com sucesso"
      });
      
      await fetchKeys();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível definir a chave como padrão"
      });
    }
  };
  
  const deleteKey = async (keyId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("pix_keys")
        .delete()
        .eq("id", keyId)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Chave excluída",
        description: "A chave PIX foi excluída com sucesso"
      });
      
      await fetchKeys();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível excluir a chave PIX"
      });
    }
  };
  
  return {
    keys,
    isLoading,
    error,
    refreshKeys: fetchKeys,
    setDefaultKey,
    deleteKey
  };
}
