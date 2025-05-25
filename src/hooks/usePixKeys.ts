
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PixKey, PixKeyType } from '@/types/payment.types';
import { useAuth } from '@/contexts/AuthContext';

export const usePixKeys = () => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPixKeys = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedKeys: PixKey[] = data?.map(key => ({
        id: key.id,
        key: key.key,
        type: key.type as PixKeyType,
        name: key.name,
        owner_name: key.name, // Use name as owner_name since database doesn't have owner_name
        user_id: key.user_id,
        is_default: key.is_default,
        created_at: key.created_at,
        updated_at: key.updated_at,
        bank_name: '' // Default empty since not in database
      })) || [];

      setPixKeys(formattedKeys);
    } catch (err) {
      console.error('Error fetching PIX keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch PIX keys');
    } finally {
      setLoading(false);
    }
  };

  const addPixKey = async (keyData: Omit<PixKey, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newKeyData = {
        key: keyData.key,
        type: keyData.type as string, // Convert enum to string for database
        name: keyData.name,
        is_default: keyData.is_default,
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('pix_keys')
        .insert([newKeyData])
        .select()
        .single();

      if (error) throw error;

      const newKey: PixKey = {
        id: data.id,
        key: data.key,
        type: data.type as PixKeyType,
        name: data.name,
        owner_name: data.name,
        user_id: data.user_id,
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.updated_at,
        bank_name: ''
      };

      setPixKeys(prev => [newKey, ...prev]);
      return newKey;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add PIX key');
    }
  };

  useEffect(() => {
    fetchPixKeys();
  }, [user]);

  return {
    pixKeys,
    loading,
    isLoadingPixKeys: loading, // Add this alias for backward compatibility
    error,
    refetch: fetchPixKeys,
    addPixKey,
  };
};
