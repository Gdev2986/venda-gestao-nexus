
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';
import { MachineStatus } from "@/types/machine.types";

export interface SaleInsert {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: "CREDIT" | "DEBIT" | "PIX";
  machine_id: string;
  processing_status: "RAW" | "PROCESSED";
  created_at: string;
  updated_at: string;
  installments?: number;
  source?: string;
}

// Helper function to convert Brazilian date format to ISO
const convertBrazilianDateToISO = (dateStr: string): string => {
  // Handle different Brazilian date formats
  const patterns = [
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/,     // dd/MM/yyyy HH:mm
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/, // dd/MM/yyyy HH:mm:ss
    /^(\d{2})\/(\d{2})\/(\d{4})$/,                        // dd/MM/yyyy
  ];

  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      const [, day, month, year, hours = '00', minutes = '00', seconds = '00'] = match;
      // Create ISO string: YYYY-MM-DDTHH:mm:ss.sssZ
      const isoDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      return isoDate.toISOString();
    }
  }
  
  // If no pattern matches, try to parse as-is
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (e) {
    console.warn('Could not parse date:', dateStr);
  }
  
  // Fallback to current date
  return new Date().toISOString();
};

// Optimized function to batch check and create machines
const ensureMachinesExist = async (terminals: string[]): Promise<Map<string, string>> => {
  try {
    console.log(`Checking/creating machines for ${terminals.length} unique terminals`);
    
    // First, get all existing machines for the terminals in one query
    const { data: existingMachines, error: findError } = await supabase
      .from('machines')
      .select('id, serial_number')
      .in('serial_number', terminals);

    if (findError) {
      throw findError;
    }

    // Create a map of existing machines
    const existingMachinesMap = new Map<string, string>();
    existingMachines?.forEach(machine => {
      existingMachinesMap.set(machine.serial_number, machine.id);
    });

    // Find terminals that don't have machines yet
    const missingTerminals = terminals.filter(terminal => 
      !existingMachinesMap.has(terminal)
    );

    console.log(`Found ${existingMachines?.length || 0} existing machines, need to create ${missingTerminals.length} new ones`);

    // Create missing machines in batch
    if (missingTerminals.length > 0) {
      const newMachinesData = missingTerminals.map(terminal => ({
        serial_number: terminal,
        model: 'PagBank',
        status: MachineStatus.STOCK,
        notes: `Criado automaticamente durante importação de vendas em ${new Date().toLocaleDateString('pt-BR')}`
      }));

      const { data: newMachines, error: createError } = await supabase
        .from('machines')
        .insert(newMachinesData)
        .select('id, serial_number');

      if (createError) {
        throw createError;
      }

      // Add new machines to the map
      newMachines?.forEach(machine => {
        existingMachinesMap.set(machine.serial_number, machine.id);
      });

      console.log(`Created ${newMachines?.length || 0} new machines`);
    }

    return existingMachinesMap;

  } catch (error) {
    console.error(`Error ensuring machines exist:`, error);
    throw new Error(`Falha ao verificar/criar máquinas: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to convert payment type to enum
const convertPaymentMethod = (paymentType: string): "CREDIT" | "DEBIT" | "PIX" => {
  const normalizedType = paymentType.toLowerCase();
  if (normalizedType.includes('crédito') || normalizedType.includes('credito')) {
    return 'CREDIT';
  } else if (normalizedType.includes('débito') || normalizedType.includes('debito')) {
    return 'DEBIT';
  } else {
    return 'PIX';
  }
};

export const insertSales = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    console.log(`Starting insertion of ${sales.length} sales`);
    
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

    // Insert sales in smaller batches to avoid issues
    const batchSize = 100;
    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(salesData.length / batchSize)} (${batch.length} records)`);
      
      const { error } = await supabase
        .from('sales')
        .insert(batch);

      if (error) {
        console.error('Error inserting sales batch:', error);
        throw new Error(`Erro ao inserir lote de vendas: ${error.message}`);
      }
    }

    console.log(`Successfully inserted ${salesData.length} sales`);
    
  } catch (error) {
    console.error('Error in insertSales:', error);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        machines (
          serial_number,
          model
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
      throw new Error(`Erro ao buscar vendas: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllSales:', error);
    throw error;
  }
};
