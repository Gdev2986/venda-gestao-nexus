
import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";

export interface SalesFilters {
  dateStart?: string;
  dateEnd?: string;
  hourStart?: string;
  minuteStart?: string;
  hourEnd?: string;
  minuteEnd?: string;
  terminals?: string[]; // Unificado - usar apenas este
  paymentType?: string;
  source?: string;
  brand?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginatedSalesResult {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface SalesDateRange {
  earliest_date: string;
  latest_date: string;
  total_records: number;
}

export interface SalesSummary {
  total_records: number;
  total_amount: number;
  earliest_date: string;
  latest_date: string;
}

export interface SalesAggregatedStats {
  total_sales: number;
  total_gross_amount: number;
  total_net_amount: number;
  office_commission: number;
}

class OptimizedSalesService {
  // Função para obter ontem em formato YYYY-MM-DD
  getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Função principal para buscar vendas paginadas com filtros aplicados no SQL
  async getSalesPaginated(
    page: number = 1, 
    pageSize: number = 10, 
    filters: SalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      console.log('Calling getSalesPaginated with filters:', filters);

      const { data, error } = await supabase.rpc('get_sales_optimized', {
        page_number: page,
        page_size: pageSize,
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: filters.hourStart || null,
        filter_hour_end: filters.hourEnd || null,
        filter_terminals: filters.terminals || null, // Passar array de terminais para SQL
        filter_payment_type: filters.paymentType || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error in getSalesPaginated:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      const totalCount = data[0]?.total_count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      // Transformar dados para NormalizedSale
      const sales: NormalizedSale[] = data.map((row: any) => ({
        id: row.id,
        terminal: row.terminal,
        transaction_date: row.date,
        gross_amount: parseFloat(row.gross_amount),
        formatted_amount: `R$ ${parseFloat(row.gross_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        payment_type: this.mapPaymentMethod(row.payment_method),
        installments: row.installments,
        source: row.source || 'Unknown',
        brand: this.getBrandFromPayment(row.payment_method),
        status: 'Aprovada'
      }));

      console.log(`Loaded page ${page}: ${sales.length} sales, total: ${totalCount}`);

      return {
        sales,
        totalCount,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('Error in getSalesPaginated:', error);
      throw error;
    }
  }

  // Função para obter estatísticas agregadas do período filtrado
  async getSalesAggregatedStats(filters: SalesFilters = {}): Promise<SalesAggregatedStats> {
    try {
      const { data, error } = await supabase.rpc('get_sales_aggregated_stats', {
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: filters.hourStart || null,
        filter_hour_end: filters.hourEnd || null,
        filter_terminals: filters.terminals || null, // Usar array de terminais
        filter_payment_type: filters.paymentType || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error in getSalesAggregatedStats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          total_sales: 0,
          total_gross_amount: 0,
          total_net_amount: 0,
          office_commission: 0
        };
      }

      return data[0];
    } catch (error) {
      console.error('Error in getSalesAggregatedStats:', error);
      throw error;
    }
  }

  // Função para obter range de datas
  async getDateRange(): Promise<SalesDateRange> {
    try {
      const { data, error } = await supabase.rpc('get_sales_date_range');
      
      if (error) {
        console.error('Error getting date range:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No date range data found');
      }

      return data[0];
    } catch (error) {
      console.error('Error in getDateRange:', error);
      throw error;
    }
  }

  // Função para obter datas com vendas
  async getDatesWithSales(): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('get_dates_with_sales');
      
      if (error) {
        console.error('Error getting dates with sales:', error);
        throw error;
      }

      return data ? data.map((row: any) => row.sale_date) : [];
    } catch (error) {
      console.error('Error in getDatesWithSales:', error);
      throw error;
    }
  }

  // Função para obter resumo geral das vendas
  async getSalesSummary(): Promise<SalesSummary> {
    try {
      const { data, error } = await supabase.rpc('get_sales_summary');
      
      if (error) {
        console.error('Error getting sales summary:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No sales summary data found');
      }

      return data[0];
    } catch (error) {
      console.error('Error in getSalesSummary:', error);
      throw error;
    }
  }

  // Função para obter terminais únicos com busca
  async getUniqueTerminals(searchTerm: string = ''): Promise<Array<{terminal: string, usage_count: number}>> {
    try {
      const { data, error } = await supabase.rpc('get_unique_terminals', {
        search_term: searchTerm
      });
      
      if (error) {
        console.error('Error getting unique terminals:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUniqueTerminals:', error);
      throw error;
    }
  }

  // Helpers para mapear tipos de pagamento
  private mapPaymentMethod(method: string): string {
    switch (method?.toUpperCase()) {
      case 'CREDIT':
        return 'CREDIT';
      case 'DEBIT': 
        return 'DEBIT';
      case 'PIX':
        return 'PIX';
      default:
        return method || 'UNKNOWN';
    }
  }

  private getBrandFromPayment(method: string): string {
    switch (method?.toUpperCase()) {
      case 'CREDIT':
        return 'Visa'; // Padrão para crédito
      case 'DEBIT':
        return 'Mastercard'; // Padrão para débito
      case 'PIX':
        return 'Pix';
      default:
        return 'Outros';
    }
  }
}

export const optimizedSalesService = new OptimizedSalesService();
