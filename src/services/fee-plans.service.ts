
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
        *,
        fee_plan_rates (
          id,
          payment_method,
          installments,
          rate_percentage
        )
      `)
      .order('name');

    if (error) throw error;
    
    return (data || []).map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      rates: plan.fee_plan_rates || []
    }));
  },

  // Buscar plano de taxa vinculado a um cliente
  async getClientFeePlan(clientId: string): Promise<ClientFeePlan | null> {
    const { data, error } = await supabase
      .from('client_fee_plans')
      .select(`
        *,
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

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    if (data?.fee_plan) {
      // Map fee_plan_rates to rates in the fee_plan object
      const transformedFeePlan = {
        id: data.fee_plan.id,
        name: data.fee_plan.name,
        description: data.fee_plan.description,
        rates: data.fee_plan.fee_plan_rates || []
      };
      
      return {
        ...data,
        fee_plan: transformedFeePlan
      };
    }

    return data;
  },

  // Vincular plano de taxa a cliente
  async assignFeePlanToClient(
    clientId: string, 
    feePlanId: string, 
    assignedBy: string, 
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('client_fee_plans')
      .upsert({
        client_id: clientId,
        fee_plan_id: feePlanId,
        assigned_by: assignedBy,
        notes
      });

    if (error) throw error;
  },

  async removeFeePlanFromClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('client_fee_plans')
      .delete()
      .eq('client_id', clientId);

    if (error) throw error;
  },

  async createFeePlan(name: string, description?: string): Promise<FeePlan> {
    const { data, error } = await supabase
      .from('fee_plans')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;
    return { ...data, rates: [] };
  },

  async addRateToFeePlan(
    feePlanId: string,
    paymentMethod: string,
    installments: number,
    ratePercentage: number
  ): Promise<FeePlanRate> {
    const { data, error } = await supabase
      .from('fee_plan_rates')
      .insert({
        fee_plan_id: feePlanId,
        payment_method: paymentMethod,
        installments,
        rate_percentage: ratePercentage
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFeePlanRate(
    rateId: string,
    ratePercentage: number
  ): Promise<void> {
    const { error } = await supabase
      .from('fee_plan_rates')
      .update({ rate_percentage: ratePercentage })
      .eq('id', rateId);

    if (error) throw error;
  },

  async removeFeePlanRate(rateId: string): Promise<void> {
    const { error } = await supabase
      .from('fee_plan_rates')
      .delete()
      .eq('id', rateId);

    if (error) throw error;
  }
};
