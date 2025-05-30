
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';
import { BatchProcessor } from './batch-processor';

// Função otimizada para inserção de vendas
const insertBatch = async (salesData: SaleInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('sales')
    .insert(salesData);

  if (error) {
    throw new Error(`Database insertion error: ${error.message}`);
  }
};

// Função principal otimizada
export const insertSalesOptimized = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting optimized insertion of ${sales.length} sales`);
    
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

    // Use batch processor for optimized insertion with 500 records per batch
    const processor = new BatchProcessor({
      batchSize: 500, // Increased from 150 to 500
      maxConcurrent: 2, // Limit concurrent operations
      retryAttempts: 3,
      delayBetweenBatches: 150 // Slight delay between batches
    });

    const batches = processor.createBatches(salesData);
    console.log(`Created ${batches.length} batches for processing`);

    await processor.processBatchesInParallel(batches, async (batch) => {
      await insertBatch(batch);
    });

    console.log(`Successfully inserted all ${salesData.length} sales!`);
    
  } catch (error) {
    console.error('Error in optimized insertSales:', error);
    throw error;
  }
};
