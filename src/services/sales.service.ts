
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

      return {
        code: sale.id || `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        terminal: sale.terminal,
        date: typeof sale.transaction_date === 'string' 
          ? sale.transaction_date 
          : sale.transaction_date.toISOString(),
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
