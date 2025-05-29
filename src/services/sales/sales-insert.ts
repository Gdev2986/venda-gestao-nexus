
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';

// Função para tentar inserir com retry em caso de falha
const insertWithRetry = async (salesData: SaleInsert[], maxRetries: number = 3): Promise<void> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt} de ${maxRetries} para inserir ${salesData.length} registros`);
      
      // Usar INSERT direto em vez de upsert para evitar problemas com o trigger
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
      
      // Aguardar antes da próxima tentativa (backoff exponencial)
      const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
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

export const insertSales = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting insertion of ${sales.length} sales`);
    
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

    // Insert sales in smaller batches to avoid trigger conflicts
    const batchSize = 25; // Batches menores para evitar problemas
    let totalInserted = 0;
    
    for (let i = 0; i < uniqueSalesData.length; i += batchSize) {
      const batch = uniqueSalesData.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(uniqueSalesData.length / batchSize);
      
      console.log(`Processing batch ${batchNumber} of ${totalBatches} (${batch.length} records)`);
      
      try {
        // Usar função com retry para cada batch
        await insertWithRetry(batch, 3);
        totalInserted += batch.length;
        console.log(`Batch ${batchNumber} inserted successfully. Total so far: ${totalInserted}/${uniqueSalesData.length}`);
        
        // Pequena pausa entre batches para dar tempo ao trigger processar
        if (i + batchSize < uniqueSalesData.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`Failed to insert batch ${batchNumber} after all retries:`, error);
        throw new Error(`Falha ao inserir lote ${batchNumber}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(`Successfully inserted all ${totalInserted} sales!`);
    
  } catch (error) {
    console.error('Error in insertSales:', error);
    throw error;
  }
};
