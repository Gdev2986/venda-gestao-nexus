import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";

export interface SaleInsert {
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: "CREDIT" | "DEBIT" | "PIX";
  client_id: string;
  machine_id?: string;
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

export const insertSales = async (sales: NormalizedSale[]): Promise<void> => {
  try {
    // Convert normalized sales to database format
    const salesData: SaleInsert[] = sales.map(sale => {
      // Convert payment type to enum
      let paymentMethod: "CREDIT" | "DEBIT" | "PIX" = "PIX";
      const normalizedType = sale.payment_type.toLowerCase();
      
      if (normalizedType.includes('crédito') || normalizedType.includes('credito')) {
        paymentMethod = 'CREDIT';
      } else if (normalizedType.includes('débito') || normalizedType.includes('debito')) {
        paymentMethod = 'DEBIT';
      }

      // Calculate net amount (simple calculation: 97% of gross)
      const netAmount = sale.gross_amount * 0.97;

      // Convert date to proper ISO format
      let isoDate: string;
      if (typeof sale.transaction_date === 'string') {
        isoDate = convertBrazilianDateToISO(sale.transaction_date);
      } else {
        isoDate = sale.transaction_date.toISOString();
      }

      return {
        code: sale.id || `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        terminal: sale.terminal,
        date: isoDate,
        gross_amount: sale.gross_amount,
        net_amount: netAmount,
        payment_method: paymentMethod,
        client_id: '00000000-0000-0000-0000-000000000000', // Will need proper client mapping
      };
    });

    const { error } = await supabase
      .from('sales')
      .insert(salesData);

    if (error) {
      console.error('Error inserting sales:', error);
      throw new Error(`Erro ao inserir vendas: ${error.message}`);
    }
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
        clients (
          business_name
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
