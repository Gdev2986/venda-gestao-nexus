
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethod } from "@/types/enums";

export interface TaxBlock {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaxRate {
  id: string;
  block_id: string;
  payment_method: string;
  installment: number;
  root_rate: number;
  forwarding_rate: number;
  final_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlockWithRates extends TaxBlock {
  rates?: TaxRate[];
}

export interface ClientTaxBlockAssociation {
  id: string;
  client_id: string;
  block_id: string;
  created_at?: string;
}

export const TaxBlocksService = {
  // Fetch all tax blocks
  async getTaxBlocks(): Promise<BlockWithRates[]> {
    try {
      const { data: blocks, error } = await supabase
        .from('tax_blocks')
        .select('*')
        .order('name');

      if (error) throw error;

      // Get rates for all blocks
      const blocksWithRates: BlockWithRates[] = [];
      
      for (const block of blocks || []) {
        const rates = await this.getTaxRatesForBlock(block.id);
        blocksWithRates.push({
          ...block,
          rates
        });
      }

      return blocksWithRates;
    } catch (error) {
      console.error("Error fetching tax blocks:", error);
      return [];
    }
  },

  // Get a single tax block with its rates
  async getTaxBlock(id: string): Promise<BlockWithRates | null> {
    try {
      const { data, error } = await supabase
        .from('tax_blocks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      const rates = await this.getTaxRatesForBlock(id);
      
      return {
        ...data,
        rates
      };
    } catch (error) {
      console.error(`Error fetching tax block ${id}:`, error);
      return null;
    }
  },

  // Get rates for a specific block
  async getTaxRatesForBlock(blockId: string): Promise<TaxRate[]> {
    try {
      const { data, error } = await supabase
        .from('tax_rates')
        .select('*')
        .eq('block_id', blockId)
        .order('payment_method')
        .order('installment');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching tax rates for block ${blockId}:`, error);
      return [];
    }
  },

  // Create a new tax block
  async createTaxBlock(block: Omit<TaxBlock, 'id' | 'created_at' | 'updated_at'>): Promise<TaxBlock | null> {
    try {
      const { data, error } = await supabase
        .from('tax_blocks')
        .insert(block)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating tax block:", error);
      return null;
    }
  },

  // Update an existing tax block
  async updateTaxBlock(id: string, updates: Partial<TaxBlock>): Promise<TaxBlock | null> {
    try {
      const { data, error } = await supabase
        .from('tax_blocks')
        .update({
          name: updates.name,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating tax block ${id}:`, error);
      return null;
    }
  },

  // Delete a tax block (this will cascade delete all associated rates due to FK constraints)
  async deleteTaxBlock(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tax_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting tax block ${id}:`, error);
      return false;
    }
  },

  // Create or update tax rates for a block
  async saveTaxRates(blockId: string, rates: Omit<TaxRate, 'id' | 'block_id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      // First get existing rates
      const existingRates = await this.getTaxRatesForBlock(blockId);
      
      // For each rate, either update existing or create new
      for (const rate of rates) {
        const existingRate = existingRates.find(
          r => r.payment_method === rate.payment_method && r.installment === rate.installment
        );
        
        if (existingRate) {
          // Update existing rate
          await supabase
            .from('tax_rates')
            .update({
              root_rate: rate.root_rate,
              forwarding_rate: rate.forwarding_rate,
              final_rate: rate.final_rate,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingRate.id);
        } else {
          // Create new rate
          await supabase
            .from('tax_rates')
            .insert({
              block_id: blockId,
              payment_method: rate.payment_method,
              installment: rate.installment,
              root_rate: rate.root_rate,
              forwarding_rate: rate.forwarding_rate,
              final_rate: rate.final_rate
            });
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving tax rates for block ${blockId}:`, error);
      return false;
    }
  },

  // Associate a tax block with a client
  async associateBlockWithClient(blockId: string, clientId: string): Promise<boolean> {
    try {
      // First check if there's an existing association
      const { data: existing } = await supabase
        .from('client_tax_blocks')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (existing) {
        // Update existing association
        const { error } = await supabase
          .from('client_tax_blocks')
          .update({ block_id: blockId })
          .eq('client_id', clientId);
          
        if (error) throw error;
      } else {
        // Create new association
        const { error } = await supabase
          .from('client_tax_blocks')
          .insert({ client_id: clientId, block_id: blockId });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error associating block ${blockId} with client ${clientId}:`, error);
      return false;
    }
  },

  // Get the tax block associated with a client
  async getClientTaxBlock(clientId: string): Promise<BlockWithRates | null> {
    try {
      // First get the association
      const { data: association, error } = await supabase
        .from('client_tax_blocks')
        .select('block_id')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (error) throw error;
      if (!association) return null;
      
      // Then get the block details with rates
      return await this.getTaxBlock(association.block_id);
    } catch (error) {
      console.error(`Error getting tax block for client ${clientId}:`, error);
      return null;
    }
  },

  // Get rates for a specific payment method and installment count for a client
  async getClientTaxRate(clientId: string, paymentMethod: PaymentMethod, installment: number): Promise<TaxRate | null> {
    try {
      const block = await this.getClientTaxBlock(clientId);
      if (!block || !block.rates) return null;
      
      const rate = block.rates.find(
        r => r.payment_method === paymentMethod.toString() && r.installment === installment
      );
      
      return rate || null;
    } catch (error) {
      console.error(`Error getting tax rate for client ${clientId}:`, error);
      return null;
    }
  },

  // Get all client-block associations
  async getClientTaxBlockAssociations(): Promise<{clientId: string, clientName: string, blockId: string, blockName: string}[]> {
    try {
      const { data, error } = await supabase
        .from('client_tax_blocks')
        .select(`
          client_id,
          block_id,
          clients:client_id(business_name),
          blocks:block_id(name)
        `);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        clientId: item.client_id,
        clientName: item.clients?.business_name || '',
        blockId: item.block_id,
        blockName: item.blocks?.name || ''
      }));
    } catch (error) {
      console.error("Error fetching client tax block associations:", error);
      return [];
    }
  },
  
  // Get clients without tax block associations
  async getClientsWithoutTaxBlock(): Promise<{id: string, name: string}[]> {
    try {
      const { data, error } = await supabase.rpc(
        'get_clients_without_tax_block'
      );
      
      if (error) {
        // If RPC fails, fall back to client-side filtering
        const { data: allClients } = await supabase
          .from('clients')
          .select('id, business_name');
          
        const { data: associations } = await supabase
          .from('client_tax_blocks')
          .select('client_id');
          
        const associatedIds = new Set((associations || []).map(a => a.client_id));
        
        return (allClients || [])
          .filter(client => !associatedIds.has(client.id))
          .map(client => ({
            id: client.id,
            name: client.business_name
          }));
      }
      
      return (data || []).map(client => ({
        id: client.id,
        name: client.business_name
      }));
    } catch (error) {
      console.error("Error getting clients without tax block:", error);
      return [];
    }
  }
};
