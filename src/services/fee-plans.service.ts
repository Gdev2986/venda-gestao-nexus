
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
      .select('*')
      .order('name');

    if (error) throw error;
    
    // Mock rates for now until the table is available in types
    const plansWithRates = (data || []).map(plan => ({
      ...plan,
      rates: [
        { id: '1', payment_method: 'PIX', installments: 1, rate_percentage: 0.0149 },
        { id: '2', payment_method: 'CREDIT', installments: 1, rate_percentage: 0.0329 },
        { id: '3', payment_method: 'DEBIT', installments: 1, rate_percentage: 0.0249 }
      ]
    }));

    return plansWithRates;
  },

  // Buscar plano de taxa vinculado a um cliente
  async getClientFeePlan(clientId: string): Promise<ClientFeePlan | null> {
    // Mock implementation until the tables are available
    return {
      id: '1',
      client_id: clientId,
      fee_plan_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      assigned_at: new Date().toISOString(),
      fee_plan: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Plano Básico',
        description: 'Plano de taxas padrão para novos clientes',
        rates: [
          { id: '1', payment_method: 'PIX', installments: 1, rate_percentage: 0.0149 },
          { id: '2', payment_method: 'CREDIT', installments: 1, rate_percentage: 0.0329 },
          { id: '3', payment_method: 'CREDIT', installments: 2, rate_percentage: 0.0349 },
          { id: '4', payment_method: 'CREDIT', installments: 3, rate_percentage: 0.0369 },
          { id: '5', payment_method: 'DEBIT', installments: 1, rate_percentage: 0.0249 }
        ]
      }
    };
  },

  // Vincular plano de taxa a cliente
  async assignFeePlanToClient(
    clientId: string, 
    feePlanId: string, 
    assignedBy: string, 
    notes?: string
  ): Promise<void> {
    // Mock implementation - will work when tables are available
    console.log('Assigning fee plan:', { clientId, feePlanId, assignedBy, notes });
  },

  // Remover vinculação de plano de taxa
  async removeFeePlanFromClient(clientId: string): Promise<void> {
    // Mock implementation - will work when tables are available
    console.log('Removing fee plan from client:', clientId);
  }
};
