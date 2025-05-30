
import { supabase } from "@/integrations/supabase/client";

export interface FeePlan {
  id: string;
  name: string;
  description?: string;
  rates?: FeePlanRate[];
}

export interface FeePlanRate {
  id: string;
  payment_method: string;
  installments: number;
  rate_percentage: number;
}

export interface ClientFeePlan {
  id: string;
  client_id: string;
  fee_plan_id: string;
  assigned_by?: string;
  assigned_at: string;
  notes?: string;
  fee_plan?: FeePlan;
}

export const FeePlansService = {
  // Buscar todos os planos de taxa
  async getFeePlans(): Promise<FeePlan[]> {
    const { data, error } = await supabase
      .from('fee_plans')
      .select(`
        id,
        name,
        description,
        fee_plan_rates (
          id,
          payment_method,
          installments,
          rate_percentage
        )
      `)
      .order('name');

    if (error) throw error;
    
    return data?.map(plan => ({
      ...plan,
      rates: plan.fee_plan_rates
    })) || [];
  },

  // Buscar plano de taxa vinculado a um cliente
  async getClientFeePlan(clientId: string): Promise<ClientFeePlan | null> {
    const { data, error } = await supabase
      .from('client_fee_plans')
      .select(`
        id,
        client_id,
        fee_plan_id,
        assigned_by,
        assigned_at,
        notes,
        fee_plan:fee_plans (
          id,
          name,
          description,
          fee_plan_rates (
            id,
            payment_method,
            installments,
            rate_percentage
          )
        )
      `)
      .eq('client_id', clientId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;

    return {
      ...data,
      fee_plan: data.fee_plan ? {
        ...data.fee_plan,
        rates: data.fee_plan.fee_plan_rates
      } : undefined
    };
  },

  // Vincular plano de taxa a cliente
  async assignFeePlanToClient(
    clientId: string, 
    feePlanId: string, 
    assignedBy: string, 
    notes?: string
  ): Promise<void> {
    // Primeiro, remover vinculação anterior se existir
    await supabase
      .from('client_fee_plans')
      .delete()
      .eq('client_id', clientId);

    // Criar nova vinculação
    const { error } = await supabase
      .from('client_fee_plans')
      .insert({
        client_id: clientId,
        fee_plan_id: feePlanId,
        assigned_by: assignedBy,
        notes
      });

    if (error) throw error;
  },

  // Remover vinculação de plano de taxa
  async removeFeePlanFromClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('client_fee_plans')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
  }
};
