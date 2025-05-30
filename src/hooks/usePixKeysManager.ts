
import { useState, useCallback } from 'react';
import { pixKeysService, CreatePixKeyData } from '@/services/pixKeys.service';
import { usePixKeys } from '@/hooks/usePixKeys';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePixKeysManager = () => {
  const { user } = useAuth();
  const { pixKeys, refetch } = usePixKeys();
  const [isLoading, setIsLoading] = useState(false);

  const createPixKey = useCallback(async (data: CreatePixKeyData) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Use the authenticated user's ID directly instead of client ID
      await pixKeysService.createPixKey(user.id, data);
      
      toast({
        title: "Sucesso",
        description: "Chave PIX cadastrada com sucesso!"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar chave PIX",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, refetch]);

  const updatePixKey = useCallback(async (keyId: string, data: Partial<CreatePixKeyData>) => {
    setIsLoading(true);
    try {
      await pixKeysService.updatePixKey(keyId, data);
      
      toast({
        title: "Sucesso",
        description: "Chave PIX atualizada com sucesso!"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar chave PIX",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  const deletePixKey = useCallback(async (keyId: string) => {
    setIsLoading(true);
    try {
      await pixKeysService.deletePixKey(keyId);
      
      toast({
        title: "Sucesso",
        description: "Chave PIX removida com sucesso!"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover chave PIX",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  const setDefaultPixKey = useCallback(async (keyId: string) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Use the authenticated user's ID directly
      await pixKeysService.setDefaultPixKey(user.id, keyId);
      
      toast({
        title: "Sucesso",
        description: "Chave PIX definida como padrão!"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao definir chave como padrão",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, refetch]);

  return {
    pixKeys,
    isLoading,
    createPixKey,
    updatePixKey,
    deletePixKey,
    setDefaultPixKey,
    refetch
  };
};
