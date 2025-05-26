import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PixKey, PixKeyType } from '@/types/payment.types';
import { useToast } from '@/hooks/use-toast';

export const usePixKeys = () => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPixKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedKeys: PixKey[] = data?.map(key => ({
        id: key.id,
        key: key.key,
        type: key.type as PixKeyType,
        name: key.name,
        owner_name: key.name,
        user_id: key.user_id,
        is_default: key.is_default,
        created_at: key.created_at,
        updated_at: key.updated_at,
        bank_name: 'Banco Digital'
      })) || [];

      setPixKeys(formattedKeys);
    } catch (err) {
      console.error('Error fetching PIX keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch PIX keys');
    } finally {
      setIsLoading(false);
    }
  };

  const addPixKey = async (pixKeyData: Omit<PixKey, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .insert([{
          ...pixKeyData,
          type: PixKeyType.EMAIL
        }])
        .select()
        .single();

      if (error) throw error;

      const newKey: PixKey = {
        ...data,
        type: data.type as PixKeyType,
        owner_name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        bank_name: 'Banco Digital'
      };

      setPixKeys(prev => [newKey, ...prev]);
      
      toast({
        title: "Chave PIX adicionada",
        description: "A chave PIX foi adicionada com sucesso.",
      });

      return newKey;
    } catch (err) {
      console.error('Error adding PIX key:', err);
      toast({
        title: "Erro ao adicionar chave PIX",
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePixKey = async (id: string, updates: Partial<PixKey>) => {
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .update({
          ...updates,
          type: PixKeyType.EMAIL
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedKey: PixKey = {
        ...data,
        type: data.type as PixKeyType,
        owner_name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        bank_name: 'Banco Digital'
      };

      setPixKeys(prev => prev.map(key => key.id === id ? updatedKey : key));
      
      toast({
        title: "Chave PIX atualizada",
        description: "A chave PIX foi atualizada com sucesso.",
      });

      return updatedKey;
    } catch (err) {
      console.error('Error updating PIX key:', err);
      toast({
        title: "Erro ao atualizar chave PIX",
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: "destructiva",
      });
      throw err;
    }
  };

  const deletePixKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pix_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPixKeys(prev => prev.filter(key => key.id !== id));
      
      toast({
        title: "Chave PIX removida",
        description: "A chave PIX foi removida com sucesso.",
      });
    } catch (err) {
      console.error('Error deleting PIX key:', err);
      toast({
        title: "Erro ao remover chave PIX",
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPixKeys();
  }, []);

  return {
    pixKeys,
    isLoading,
    error,
    addPixKey,
    updatePixKey,
    deletePixKey,
    refetch: fetchPixKeys
  };
};

export default usePixKeys;
