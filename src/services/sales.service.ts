
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { v4 as uuidv4 } from 'uuid';

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

// Helper function to ensure machine exists and get machine_id
const ensureMachineExists = async (terminal: string): Promise<string> => {
  try {
    // First, check if machine already exists
    const { data: existingMachine, error: findError } = await supabase
      .from('machines')
      .select('id')
      .eq('serial_number', terminal)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    // If machine exists, return its ID
    if (existingMachine) {
      console.log(`Machine found for terminal: ${terminal}`);
      return existingMachine.id;
    }

    // If machine doesn't exist, create it
    console.log(`Creating new machine for terminal: ${terminal}`);
    const { data: newMachine, error: createError } = await supabase
      .from('machines')
      .insert({
        serial_number: terminal,
        model: 'PagBank',
        status: 'STOCK',
        notes: `Criado automaticamente durante importação de vendas em ${new Date().toLocaleDateString('pt-BR')}`
      })
      .select('id')
      .single();

    if (createError) {
      throw createError;
    }

    console.log(`Machine created for terminal: ${terminal}, ID: ${newMachine.id}`);
    return newMachine.id;

  } catch (error) {
    console.error(`Error ensuring machine exists for terminal ${terminal}:`, error);
    throw new Error(`Falha ao verificar/criar máquina para terminal ${terminal}: ${error instanceof Error ? error.message : String(error)}`);
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
    
    // Process sales in batches to ensure machine creation happens sequentially
    const salesData: SaleInsert[] = [];
    
    for (const sale of sales) {
      try {
        // Ensure machine exists and get machine_id
        const machineId = await ensureMachineExists(sale.terminal);
        
        // Convert date to proper ISO format
        let isoDate: string;
        if (typeof sale.transaction_date === 'string') {
          isoDate = convertBrazilianDateToISO(sale.transaction_date);
        } else {
          isoDate = sale.transaction_date.toISOString();
        }

        // Calculate net amount (simple calculation: 97% of gross)
        const netAmount = sale.gross_amount * 0.97;

        // Create sale payload
        const salePayload: SaleInsert = {
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
          updated_at: new Date().toISOString()
        };

        salesData.push(salePayload);
        
      } catch (error) {
        console.error(`Error processing sale for terminal ${sale.terminal}:`, error);
        throw error;
      }
    }

    // Insert all sales at once - sem trigger complexos
    console.log(`Inserting ${salesData.length} sales into database`);
    const { error } = await supabase
      .from('sales')
      .insert(salesData);

    if (error) {
      console.error('Error inserting sales:', error);
      throw new Error(`Erro ao inserir vendas: ${error.message}`);
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
