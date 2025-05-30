import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';

// Função para tentar inserir com retry exponencial
const insertWithRetry = async (salesData: SaleInsert[], maxRetries: number = 3): Promise<void> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt} de ${maxRetries} para inserir ${salesData.length} registros`);
      
      // Usar INSERT direto com configuração de timeout otimizada
      const { error } = await supabase
        .from('sales')
        .insert(salesData);

      if (error) {
        throw new Error(`Erro na inserção: ${error.message}`);
      }

      console.log(`Sucesso na tentativa ${attempt}! ${salesData.length} registros inseridos.`);
      return; // Sucesso, sair da função
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`Tentativa ${attempt} falhou:`, error);
      
      if (attempt === maxRetries) {
        console.error(`Todas as ${maxRetries} tentativas falharam. Último erro:`, lastError);
        throw lastError;
      }
      
      // Backoff exponencial: 200ms, 400ms, 800ms...
      const waitTime = Math.min(200 * Math.pow(2, attempt - 1), 5000);
      console.log(`Aguardando ${waitTime}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Função para verificar IDs únicos e evitar duplicatas
const ensureUniqueIds = (salesData: SaleInsert[]): SaleInsert[] => {
  const usedIds = new Set<string>();
  
  return salesData.map(sale => {
    let uniqueId = sale.id;
    
    // Se o ID já existe, gerar um novo
    while (usedIds.has(uniqueId)) {
      uniqueId = uuidv4();
    }
    
    usedIds.add(uniqueId);
    
    return {
      ...sale,
      id: uniqueId
    };
  });
};

// Função para processar batches em paralelo (limitado)
const processParallelBatches = async (batches: SaleInsert[][], maxConcurrent: number = 2): Promise<void> => {
  let totalInserted = 0;
  const totalRecords = batches.reduce((sum, batch) => sum + batch.length, 0);
  
  for (let i = 0; i < batches.length; i += maxConcurrent) {
    const currentBatches = batches.slice(i, i + maxConcurrent);
    
    // Processar batches em paralelo
    const promises = currentBatches.map(async (batch, batchIndex) => {
      const globalBatchNumber = i + batchIndex + 1;
      console.log(`Processing batch ${globalBatchNumber} of ${batches.length} (${batch.length} records) in parallel`);
      
      try {
        await insertWithRetry(batch, 3);
        totalInserted += batch.length;
        console.log(`Batch ${globalBatchNumber} completed successfully. Total so far: ${totalInserted}/${totalRecords}`);
        return batch.length;
      } catch (error) {
        console.error(`Failed to insert batch ${globalBatchNumber} after all retries:`, error);
        throw new Error(`Falha ao inserir lote ${globalBatchNumber}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    
    // Aguardar todos os batches do grupo atual
    await Promise.all(promises);
    
    // Pausa entre grupos de batches para não sobrecarregar o banco
    if (i + maxConcurrent < batches.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

export const insertSales = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting optimized insertion of ${sales.length} sales`);
    
    // Verificar se há vendas para processar
    if (sales.length === 0) {
      console.log('Nenhuma venda para processar');
      return;
    }
    
    // Get unique terminals from all sales
    const uniqueTerminals = [...new Set(sales.map(sale => sale.terminal))];
    console.log(`Processing ${uniqueTerminals.length} unique terminals`);
    
    // Ensure all machines exist in one batch operation
    const machinesMap = await ensureMachinesExist(uniqueTerminals);
    
    // Process all sales now that we have all machine IDs
    const salesData: SaleInsert[] = sales.map(sale => {
      // Get machine ID from our map
      const machineId = machinesMap.get(sale.terminal);
      if (!machineId) {
        throw new Error(`Machine ID not found for terminal: ${sale.terminal}`);
      }

      // Convert date to proper ISO format
      let isoDate: string;
      if (typeof sale.transaction_date === 'string') {
        isoDate = convertBrazilianDateToISO(sale.transaction_date);
      } else {
        isoDate = sale.transaction_date.toISOString();
      }

      // Calculate net amount (simple calculation: 97% of gross)
      const netAmount = sale.gross_amount * 0.97;

      // Create sale payload with installments and source
      return {
        id: uuidv4(),
        code: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        terminal: sale.terminal,
        date: isoDate,
        gross_amount: sale.gross_amount,
        net_amount: netAmount,
        payment_method: convertPaymentMethod(sale.payment_type),
        machine_id: machineId,
        processing_status: 'RAW' as "RAW" | "PROCESSED",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        installments: sale.installments,
        source: sale.source
      };
    });

    // Garantir IDs únicos
    const uniqueSalesData = ensureUniqueIds(salesData);

    // Aumentar batch size para 500 registros por batch
    const batchSize = 500; // Increased from 150 to 500
    
    // Criar batches
    const batches: SaleInsert[][] = [];
    for (let i = 0; i < uniqueSalesData.length; i += batchSize) {
      batches.push(uniqueSalesData.slice(i, i + batchSize));
    }
    
    console.log(`Created ${batches.length} batches of ~${batchSize} records each`);
    
    // Processar batches com paralelismo limitado
    await processParallelBatches(batches, 2); // Máximo 2 batches simultâneos
    
    console.log(`Successfully inserted all ${uniqueSalesData.length} sales!`);
    
  } catch (error) {
    console.error('Error in insertSales:', error);
    throw error;
  }
};
