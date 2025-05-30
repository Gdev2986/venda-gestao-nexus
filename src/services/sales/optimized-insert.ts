
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';
import { AdaptiveBatchProcessor } from './adaptive-batch-processor';

// Função otimizada para inserção de vendas com timeout personalizado
const insertBatch = async (salesData: SaleInsert[]): Promise<void> => {
  console.log(`Inserting batch of ${salesData.length} records`);
  const startTime = Date.now();
  
  const { error } = await supabase
    .from('sales')
    .insert(salesData);

  const endTime = Date.now();
  console.log(`Batch insertion took ${endTime - startTime}ms`);

  if (error) {
    console.error('Database insertion error:', error);
    throw new Error(`Database insertion error: ${error.message}`);
  }
};

// Função principal com sistema adaptativo de batch
export const insertSalesOptimized = async (
  sales: NormalizedSale[], 
  onProgress?: (completed: number, total: number, percentage: number, strategy?: string, estimatedTime?: number) => void
): Promise<void> => {
  try {
    console.log(`Starting adaptive insertion of ${sales.length} sales`);
    
    if (sales.length === 0) {
      console.log('No sales to process');
      return;
    }

    // Determinar estratégia baseada no volume de dados
    const config = AdaptiveBatchProcessor.determineStrategy(sales.length);
    const strategyDescription = AdaptiveBatchProcessor.getStrategyDescription(config.strategy);
    
    console.log(`Selected strategy: ${config.strategy.toUpperCase()}`);
    console.log(`Strategy description: ${strategyDescription}`);
    console.log(`Estimated processing time: ~${config.estimatedTimeMinutes} minutes`);
    
    // Ensure all machines exist
    const uniqueTerminals = [...new Set(sales.map(sale => sale.terminal))];
    console.log(`Ensuring ${uniqueTerminals.length} unique terminals exist as machines`);
    
    const machinesMap = await ensureMachinesExist(uniqueTerminals);
    
    // Transform sales data
    const salesData: SaleInsert[] = sales.map(sale => {
      const machineId = machinesMap.get(sale.terminal);
      if (!machineId) {
        throw new Error(`Machine ID not found for terminal: ${sale.terminal}`);
      }

      let isoDate: string;
      if (typeof sale.transaction_date === 'string') {
        isoDate = convertBrazilianDateToISO(sale.transaction_date);
      } else {
        isoDate = sale.transaction_date.toISOString();
      }

      return {
        id: uuidv4(),
        code: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        terminal: sale.terminal,
        date: isoDate,
        gross_amount: sale.gross_amount,
        net_amount: sale.gross_amount * 0.97,
        payment_method: convertPaymentMethod(sale.payment_type),
        machine_id: machineId,
        processing_status: 'RAW' as "RAW" | "PROCESSED",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        installments: sale.installments,
        source: sale.source
      };
    });

    // Create batches with adaptive size
    const batches = AdaptiveBatchProcessor.createBatches(salesData, config.batchSize);
    console.log(`Created ${batches.length} adaptive batches using ${config.strategy} strategy`);

    const totalStartTime = Date.now();
    
    // Process batches with adaptive configuration
    await AdaptiveBatchProcessor.processBatchesSequentially(
      batches, 
      async (batch) => {
        await insertBatch(batch);
      }, 
      config,
      (completed, total, percentage, strategy) => {
        if (onProgress) {
          onProgress(completed, total, percentage, strategy, config.estimatedTimeMinutes);
        }
      }
    );

    const totalEndTime = Date.now();
    const totalDuration = totalEndTime - totalStartTime;
    console.log(`Successfully inserted all ${salesData.length} sales in ${totalDuration}ms (${(totalDuration/1000).toFixed(2)}s) using ${config.strategy} strategy!`);
    
  } catch (error) {
    console.error('Error in adaptive insertSales:', error);
    throw error;
  }
};
