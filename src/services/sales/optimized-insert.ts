
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';
import { BatchProcessor } from './batch-processor';

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

// Função principal otimizada com parâmetros mais conservadores
export const insertSalesOptimized = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting ultra-optimized insertion of ${sales.length} sales`);
    
    if (sales.length === 0) {
      console.log('No sales to process');
      return;
    }
    
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

    // Use ultra-optimized batch processor with conservative settings
    const processor = new BatchProcessor({
      batchSize: 75, // Smaller batches for better reliability
      maxConcurrent: 1, // Sequential processing to avoid overwhelming DB
      retryAttempts: 3,
      delayBetweenBatches: 750 // Longer delay for DB recovery
    });

    const batches = processor.createBatches(salesData);
    console.log(`Created ${batches.length} optimized batches for processing`);

    const totalStartTime = Date.now();
    
    await processor.processBatchesInParallel(batches, async (batch) => {
      await insertBatch(batch);
    });

    const totalEndTime = Date.now();
    const totalDuration = totalEndTime - totalStartTime;
    console.log(`Successfully inserted all ${salesData.length} sales in ${totalDuration}ms (${(totalDuration/1000).toFixed(2)}s)!`);
    
  } catch (error) {
    console.error('Error in ultra-optimized insertSales:', error);
    throw error;
  }
};
