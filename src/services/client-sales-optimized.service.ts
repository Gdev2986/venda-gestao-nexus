
import { supabase } from "@/integrations/supabase/client";

export interface ClientSalesResult {
  sale_id: string;
  code: string;
  terminal: string;
  transaction_date: string;
  gross_amount: number;
  net_amount: number;
  tax_amount: number;
  tax_rate: number;
  payment_type: string;
  installments: number;
  total_count: number;
}

export interface ClientSalesStats {
  total_transactions: number;
  total_gross: number;
  total_net: number;
  total_taxes: number;
  payment_method_stats: {
    [key: string]: {
      gross: number;
      net: number;
      taxes: number;
      count: number;
    }
  };
}

export const clientSalesOptimizedService = {
  // Buscar vendas do cliente usando a nova função SQL
  async getClientSalesWithTaxes(
    clientId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    pageSize: number = 1000
  ) {
    try {
      console.log('clientSalesOptimizedService: Getting sales for client:', clientId);
      
      const { data, error } = await supabase.rpc('get_client_sales_with_taxes', {
        p_client_id: clientId,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_page: page,
        p_page_size: pageSize
      });

      if (error) {
        console.error('Error fetching client sales:', error);
        throw error;
      }

      const sales = (data as ClientSalesResult[]) || [];
      const totalCount = sales.length > 0 ? sales[0].total_count : 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      console.log('clientSalesOptimizedService: Got sales:', {
        salesCount: sales.length,
        totalCount,
        totalPages
      });

      return {
        sales: sales.map(sale => ({
          id: sale.sale_id,
          code: sale.code,
          terminal: sale.terminal,
          transaction_date: sale.transaction_date,
          gross_amount: sale.gross_amount,
          net_amount: sale.net_amount,
          tax_amount: sale.tax_amount,
          tax_rate: sale.tax_rate,
          payment_type: sale.payment_type,
          installments: sale.installments || 1
        })),
        totalCount,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('clientSalesOptimizedService: Error:', error);
      throw error;
    }
  },

  // Buscar estatísticas do cliente usando a nova função SQL
  async getClientSalesStats(
    clientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ClientSalesStats> {
    try {
      console.log('clientSalesOptimizedService: Getting stats for client:', clientId);
      
      const { data, error } = await supabase.rpc('get_client_sales_stats', {
        p_client_id: clientId,
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });

      if (error) {
        console.error('Error fetching client stats:', error);
        throw error;
      }

      const statsArray = data as Array<{
        total_transactions: number;
        total_gross: number;
        total_net: number;
        total_taxes: number;
        payment_method_stats: any;
      }>;

      const stats = statsArray?.[0] || {
        total_transactions: 0,
        total_gross: 0,
        total_net: 0,
        total_taxes: 0,
        payment_method_stats: {}
      };

      console.log('clientSalesOptimizedService: Got stats:', stats);

      return {
        total_transactions: Number(stats.total_transactions || 0),
        total_gross: Number(stats.total_gross || 0),
        total_net: Number(stats.total_net || 0),
        total_taxes: Number(stats.total_taxes || 0),
        payment_method_stats: stats.payment_method_stats || {}
      };

    } catch (error) {
      console.error('clientSalesOptimizedService: Error getting stats:', error);
      return {
        total_transactions: 0,
        total_gross: 0,
        total_net: 0,
        total_taxes: 0,
        payment_method_stats: {}
      };
    }
  }
};
