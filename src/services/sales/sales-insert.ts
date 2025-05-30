
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { SaleInsert } from './types';
import { convertBrazilianDateToISO, convertPaymentMethod } from './date-utils';
import { ensureMachinesExist } from './machine-utils';

// Função para tentar inserir com retry exponencial aprimorado
const insertWithRetry = async (salesData: SaleInsert[], maxRetries: number = 3): Promise<void> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt} de ${maxRetries} para inserir ${salesData.length} registros`);
      const startTime = Date.now();
      
      // Usar INSERT direto com timeout otimizado
      const { error } = await supabase
        .from('sales')
        .insert(salesData);

      const endTime = Date.now();
      console.log(`Inserção levou ${endTime - startTime}ms`);

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
      
      // Backoff exponencial: 500ms, 1000ms, 2000ms...
      const waitTime = Math.min(500 * Math.pow(2, attempt - 1), 10000);
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

// Função para processar batches sequencialmente (sem paralelismo)
const processSequentialBatches = async (batches: SaleInsert[][]): Promise<void> => {
  let totalInserted = 0;
  const totalRecords = batches.reduce((sum, batch) => sum + batch.length, 0);
  
  console.log(`Processing ${batches.length} batches sequentially for better stability`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNumber = i + 1;
    
    console.log(`Processing batch ${batchNumber} of ${batches.length} (${batch.length} records)`);
    
    try {
      await insertWithRetry(batch, 3);
      totalInserted += batch.length;
      console.log(`Batch ${batchNumber} completed successfully. Total so far: ${totalInserted}/${totalRecords} (${((totalInserted/totalRecords)*100).toFixed(1)}%)`);
      
      // Pausa entre batches para dar tempo ao banco de processar
      if (i < batches.length - 1) {
        console.log('Waiting 1000ms before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`Failed to insert batch ${batchNumber} after all retries:`, error);
      throw new Error(`Falha ao inserir lote ${batchNumber}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export const insertSales = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting ultra-conservative insertion of ${sales.length} sales`);
    
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

    // Usar batch size muito menor para evitar timeouts
    const batchSize = 75; // Reduced from 500 to 75
    
    // Criar batches
    const batches: SaleInsert[][] = [];
    for (let i = 0; i < uniqueSalesData.length; i += batchSize) {
      batches.push(uniqueSalesData.slice(i, i + batchSize));
    }
    
    console.log(`Created ${batches.length} conservative batches of ~${batchSize} records each`);
    
    // Processar batches sequencialmente para máxima estabilidade
    await processSequentialBatches(batches);
    
    console.log(`Successfully inserted all ${uniqueSalesData.length} sales!`);
    
  } catch (error) {
    console.error('Error in conservative insertSales:', error);
    throw error;
  }
};
