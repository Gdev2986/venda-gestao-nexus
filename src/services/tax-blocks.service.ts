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

export interface TaxBlockTransfer {
  id: string;
  client_id: string;
  from_block_id: string | null;
  to_block_id: string;
  transfer_date: string;
  cutoff_date: string;
  transferred_by: string | null;
  notes: string | null;
}

export interface BlockClientsCheck {
  client_count: number;
  client_names: string[];
}

export const TaxBlocksService = {
  // Fetch all tax blocks
  async getTaxBlocks(): Promise<BlockWithRates[]> {
    try {
      const { data: blocks, error } = await supabase
        .from('tax_blocks')
        .select('*')
        .order('name');

      if (error) {
        console.error("Error fetching tax blocks:", error);
        throw error;
      }

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

      if (error) {
        console.error(`Error fetching tax block ${id}:`, error);
        throw error;
      }
      
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

      if (error) {
        console.error(`Error fetching tax rates for block ${blockId}:`, error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching tax rates for block ${blockId}:`, error);
      return [];
    }
  },

  // Create a new tax block - CORRIGIDO
  async createTaxBlock(block: Omit<TaxBlock, 'id' | 'created_at' | 'updated_at'>): Promise<TaxBlock | null> {
    try {
      console.log("Creating tax block:", block);
      
      // Inserir apenas os campos name e description
      const { data, error } = await supabase
        .from('tax_blocks')
        .insert({
          name: block.name,
          description: block.description
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating tax block:", error);
        throw error;
      }
      
      console.log("Tax block created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating tax block:", error);
      return null;
    }
  },

  // Update an existing tax block
  async updateTaxBlock(id: string, updates: Partial<TaxBlock>): Promise<TaxBlock | null> {
    try {
      console.log("Updating tax block:", id, updates);
      
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

      if (error) {
        console.error(`Error updating tax block ${id}:`, error);
        throw error;
      }
      
      console.log("Tax block updated successfully:", data);
      return data;
    } catch (error) {
      console.error(`Error updating tax block ${id}:`, error);
      return null;
    }
  },

  // Delete a tax block with validation - ATUALIZADO
  async deleteTaxBlock(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log("Checking if block has clients before deletion:", id);
      
      // Verificar se o bloco possui clientes vinculados
      const { data: clientsCheck, error: checkError } = await supabase
        .rpc('check_block_has_clients', { p_block_id: id });
        
      if (checkError) {
        console.error("Error checking block clients:", checkError);
        throw checkError;
      }
      
      const clientCount = clientsCheck?.[0]?.client_count || 0;
      const clientNames = clientsCheck?.[0]?.client_names || [];
      
      if (clientCount > 0) {
        return {
          success: false,
          message: `Este bloco não pode ser excluído pois possui ${clientCount} cliente(s) vinculado(s): ${clientNames.join(', ')}. Transfira os clientes para outro bloco antes de excluir.`
        };
      }
      
      // Se não há clientes vinculados, proceder com a exclusão
      const { error: ratesError } = await supabase
        .from('tax_rates')
        .delete()
        .eq('block_id', id);
        
      if (ratesError) {
        console.error(`Error deleting tax rates for block ${id}:`, ratesError);
        throw ratesError;
      }
      
      const { error: blockError } = await supabase
        .from('tax_blocks')
        .delete()
        .eq('id', id);

      if (blockError) {
        console.error(`Error deleting tax block ${id}:`, blockError);
        throw blockError;
      }
      
      console.log("Tax block deleted successfully");
      return { success: true };
    } catch (error) {
      console.error(`Error deleting tax block ${id}:`, error);
      return { 
        success: false, 
        message: "Erro interno ao excluir o bloco de taxas" 
      };
    }
  },

  // Create or update tax rates for a block
  async saveTaxRates(blockId: string, rates: Omit<TaxRate, 'id' | 'block_id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      console.log("Saving tax rates for block:", blockId, rates);
      
      // First get existing rates
      const existingRates = await this.getTaxRatesForBlock(blockId);
      
      // Track all operations to ensure they all complete successfully
      const operations = [];
      
      // For each rate, either update existing or create new
      for (const rate of rates) {
        const existingRate = existingRates.find(
          r => r.payment_method === rate.payment_method && r.installment === rate.installment
        );
        
        if (existingRate) {
          // Update existing rate
          operations.push(
            supabase
              .from('tax_rates')
              .update({
                root_rate: rate.root_rate,
                forwarding_rate: rate.forwarding_rate,
                final_rate: rate.final_rate,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingRate.id)
          );
        } else {
          // Create new rate
          operations.push(
            supabase
              .from('tax_rates')
              .insert({
                block_id: blockId,
                payment_method: rate.payment_method,
                installment: rate.installment,
                root_rate: rate.root_rate,
                forwarding_rate: rate.forwarding_rate,
                final_rate: rate.final_rate
              })
          );
        }
      }
      
      // Execute all operations
      const results = await Promise.all(operations);
      
      // Check for any errors
      for (const result of results) {
        if (result.error) {
          console.error("Error saving tax rates:", result.error);
          return false;
        }
      }
      
      console.log("All tax rates saved successfully");
      return true;
    } catch (error) {
      console.error(`Error saving tax rates for block ${blockId}:`, error);
      return false;
    }
  },

  // Associate a tax block with a client with transfer validation - ATUALIZADO
  async associateBlockWithClient(blockId: string, clientId: string, userId?: string): Promise<{ success: boolean; message?: string; requiresTransfer?: boolean; currentBlock?: { id: string; name: string } }> {
    try {
      console.log("Associating block with client:", blockId, clientId);
      
      // Verificar se cliente já possui um bloco vinculado
      const { data: existing, error: checkError } = await supabase
        .from('client_tax_blocks')
        .select(`
          block_id,
          tax_blocks:block_id(name)
        `)
        .eq('client_id', clientId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking existing association:", checkError);
        throw checkError;
      }
      
      if (existing && existing.block_id !== blockId) {
        // Cliente já possui outro bloco vinculado
        const currentBlockName = existing.tax_blocks?.name || 'Desconhecido';
        return {
          success: false,
          requiresTransfer: true,
          currentBlock: {
            id: existing.block_id,
            name: currentBlockName
          },
          message: `Cliente já está vinculado ao bloco "${currentBlockName}"`
        };
      }
      
      if (existing && existing.block_id === blockId) {
        return {
          success: false,
          message: "Cliente já está vinculado a este bloco"
        };
      }
      
      // Criar nova associação
      const { error } = await supabase
        .from('client_tax_blocks')
        .insert({ 
          client_id: clientId, 
          block_id: blockId 
        });
        
      if (error) {
        console.error("Error creating client tax block association:", error);
        throw error;
      }
      
      console.log("Client-block association created successfully");
      return { success: true };
    } catch (error) {
      console.error(`Error associating block ${blockId} with client ${clientId}:`, error);
      return {
        success: false,
        message: "Erro interno ao vincular cliente ao bloco"
      };
    }
  },

  // Transfer client between tax blocks - NOVO
  async transferClientTaxBlock(
    clientId: string,
    fromBlockId: string,
    toBlockId: string,
    cutoffDate: string,
    transferredBy?: string,
    notes?: string
  ): Promise<boolean> {
    try {
      console.log("Transferring client tax block:", { clientId, fromBlockId, toBlockId, cutoffDate });
      
      const { data, error } = await supabase.rpc('transfer_client_tax_block', {
        p_client_id: clientId,
        p_from_block_id: fromBlockId,
        p_to_block_id: toBlockId,
        p_cutoff_date: cutoffDate,
        p_transferred_by: transferredBy || null,
        p_notes: notes || null
      });
      
      if (error) {
        console.error("Error transferring client tax block:", error);
        throw error;
      }
      
      console.log("Client tax block transferred successfully");
      return data;
    } catch (error) {
      console.error("Error in transferClientTaxBlock:", error);
      return false;
    }
  },

  // Get transfer history for a client - NOVO
  async getClientTaxBlockTransferHistory(clientId: string): Promise<TaxBlockTransfer[]> {
    try {
      const { data, error } = await supabase
        .from('tax_block_transfers')
        .select(`
          *,
          from_block:from_block_id(name),
          to_block:to_block_id(name)
        `)
        .eq('client_id', clientId)
        .order('transfer_date', { ascending: false });
        
      if (error) {
        console.error("Error fetching tax block transfer history:", error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getClientTaxBlockTransferHistory:", error);
      return [];
    }
  },

  // Get the tax block associated with a client
  async getClientTaxBlock(clientId: string): Promise<BlockWithRates | null> {
    try {
      // Primeiro buscar a associação
      const { data: association, error } = await supabase
        .from('client_tax_blocks')
        .select('block_id')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (error) {
        console.error(`Error getting tax block association for client ${clientId}:`, error);
        throw error;
      }
      
      if (!association) return null;
      
      // Então buscar os detalhes do bloco com taxas
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
      
      if (error) {
        console.error("Error fetching client tax block associations:", error);
        throw error;
      }
      
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
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name')
        .not('id', 'in', 
          supabase.from('client_tax_blocks')
            .select('client_id')
        );
      
      if (error) {
        console.error("Error getting clients without tax block:", error);
        throw error;
      }
      
      // Ensure data is an array before mapping
      return (data || []).map(client => ({
        id: client.id,
        name: client.business_name
      }));
    } catch (error) {
      console.error("Error getting clients without tax block:", error);
      return [];
    }
  },
  
  // New method to verify tax block creation and update
  async verifyTaxBlockSave(block: TaxBlock, rates?: TaxRate[]): Promise<boolean> {
    try {
      // First verify that the block exists
      const { data, error } = await supabase
        .from('tax_blocks')
        .select('*')
        .eq('id', block.id)
        .single();
        
      if (error || !data) {
        console.error("Tax block verification failed:", error);
        return false;
      }
      
      // If rates are provided, verify they exist too
      if (rates && rates.length > 0) {
        const blockId = block.id;
        const { data: ratesData, error: ratesError } = await supabase
          .from('tax_rates')
          .select('*')
          .eq('block_id', blockId);
          
        if (ratesError) {
          console.error("Tax rates verification failed:", ratesError);
          return false;
        }
        
        if (!ratesData || ratesData.length === 0) {
          console.error("No tax rates found for block:", blockId);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error verifying tax block save:", error);
      return false;
    }
  },
  // Remove association between a tax block and a client
  async removeBlockFromClient(blockId: string, clientId: string): Promise<boolean> {
    try {
      console.log("Removing block association:", blockId, clientId);
      
      const { error } = await supabase
        .from('client_tax_blocks')
        .delete()
        .eq('block_id', blockId)
        .eq('client_id', clientId);
        
      if (error) {
        console.error("Error removing client tax block association:", error);
        throw error;
      }
      
      console.log("Client-block association removed successfully");
      return true;
    } catch (error) {
      console.error(`Error removing block ${blockId} from client ${clientId}:`, error);
      return false;
    }
  },
};
