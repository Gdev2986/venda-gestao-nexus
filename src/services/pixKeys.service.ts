
import { supabase } from "@/integrations/supabase/client";
import { PixKey } from "@/types/payment.types";

export interface CreatePixKeyData {
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  key: string;
  name: string;
  owner_name: string;
  is_default?: boolean;
}

export const pixKeysService = {
  // Get PIX keys for a user (using authenticated user ID)
  async getPixKeysByUser(userId: string): Promise<PixKey[]> {
    const { data, error } = await supabase
      .from('pix_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(key => ({
      id: key.id,
      key: key.key,
      type: key.type,
      name: key.name,
      owner_name: key.owner_name || key.name,
      user_id: key.user_id,
      is_default: key.is_default,
      created_at: key.created_at,
      updated_at: key.updated_at
    }));
  },

  // Create a new PIX key using authenticated user ID
  async createPixKey(userId: string, data: CreatePixKeyData): Promise<PixKey> {
    const { data: result, error } = await supabase
      .from('pix_keys')
      .insert({
        user_id: userId, // Use the authenticated user's ID
        type: data.type,
        key: data.key,
        name: data.name,
        owner_name: data.owner_name,
        is_default: data.is_default || false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: result.id,
      key: result.key,
      type: result.type,
      name: result.name,
      owner_name: result.owner_name || result.name,
      user_id: result.user_id,
      is_default: result.is_default,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
  },

  // Update a PIX key
  async updatePixKey(keyId: string, data: Partial<CreatePixKeyData>): Promise<PixKey> {
    const { data: result, error } = await supabase
      .from('pix_keys')
      .update({
        ...(data.type && { type: data.type }),
        ...(data.key && { key: data.key }),
        ...(data.name && { name: data.name }),
        ...(data.owner_name && { owner_name: data.owner_name }),
        ...(data.is_default !== undefined && { is_default: data.is_default })
      })
      .eq('id', keyId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: result.id,
      key: result.key,
      type: result.type,
      name: result.name,
      owner_name: result.owner_name || result.name,
      user_id: result.user_id,
      is_default: result.is_default,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
  },

  // Delete a PIX key
  async deletePixKey(keyId: string): Promise<void> {
    const { error } = await supabase
      .from('pix_keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  },

  // Set a PIX key as default for the user
  async setDefaultPixKey(userId: string, keyId: string): Promise<void> {
    // First, remove default from all user's keys
    await supabase
      .from('pix_keys')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Then set the selected key as default
    const { error } = await supabase
      .from('pix_keys')
      .update({ is_default: true })
      .eq('id', keyId);

    if (error) throw error;
  }
};
