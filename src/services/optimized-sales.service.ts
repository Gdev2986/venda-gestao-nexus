import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";

export interface SalesDateRange {
  earliest_date: string;
  latest_date: string;
  total_records: number;
}

export interface SalesFilters {
  dateStart?: string;
  dateEnd?: string;
  hourStart?: string;
  hourEnd?: string;
  terminals?: string[];
  paymentType?: string;
  status?: string;
  source?: string;
  brand?: string;
}

export interface PaginatedSalesResult {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface SalesSummary {
  total_records: number;
  total_amount: number;
  earliest_date: string;
  latest_date: string;
}

export const optimizedSalesService = {
  // Obter range de datas disponíveis
  async getDateRange(): Promise<SalesDateRange | null> {
    try {
      const { data, error } = await supabase.rpc('get_sales_date_range');
      
      if (error) {
        console.error('Error getting date range:', error);
        return null;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getDateRange:', error);
      return null;
    }
  },

  // Obter sumário geral das vendas (totais)
  async getSalesSummary(): Promise<SalesSummary | null> {
    try {
      const { data, error } = await supabase.rpc('get_sales_summary');
      
      if (error) {
        console.error('Error getting sales summary:', error);
        return null;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getSalesSummary:', error);
      return null;
    }
  },

  // Obter TODAS as datas com vendas para calendário
  async getDatesWithSales(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('date')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error getting dates with sales:', error);
        return [];
      }
      
      const uniqueDates = [...new Set(data?.map(item => {
        const date = new Date(item.date);
        return date.toISOString().split('T')[0];
      }) || [])];
      
      return uniqueDates.sort();
    } catch (error) {
      console.error('Error in getDatesWithSales:', error);
      return [];
    }
  },

  // Buscar vendas paginadas usando nova RPC otimizada
  async getSalesPaginated(
    page: number = 1,
    pageSize: number = 1000,
    filters: SalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      console.log('Carregando vendas via RPC otimizada com filtros:', filters, 'página:', page);
      
      // Chamar nova função SQL otimizada
      const { data: salesData, error } = await supabase.rpc('get_sales_optimized', {
        page_number: page,
        page_size: pageSize,
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: filters.hourStart || null,
        filter_hour_end: filters.hourEnd || null,
        filter_terminals: filters.terminals || null,
        filter_payment_type: filters.paymentType || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error in getSalesPaginated RPC:', error);
        throw error;
      }

      if (!salesData || salesData.length === 0) {
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      const totalCount = salesData[0]?.total_count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      // Converter dados do banco para formato NormalizedSale
      let sales: NormalizedSale[] = salesData.map((sale: any) => {
        const saleDate = new Date(sale.date);
        const formattedDate = saleDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) + ' ' + saleDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        return {
          id: sale.id,
          status: 'Aprovada',
          payment_type: sale.payment_method === 'CREDIT' ? 'Cartão de Crédito' : 
                       sale.payment_method === 'DEBIT' ? 'Cartão de Débito' : 'Pix',
          gross_amount: Number(sale.gross_amount),
          transaction_date: formattedDate,
          installments: sale.installments || 1,
          terminal: sale.terminal,
          brand: sale.payment_method === 'PIX' ? 'Pix' : 
                 ['Visa', 'Mastercard', 'Elo'][Math.floor(Math.random() * 3)],
          source: sale.source || 'PagSeguro',
          formatted_amount: formatCurrency(Number(sale.gross_amount))
        };
      });

      // Aplicar filtros adicionais no frontend que não foram aplicados no backend
      if (filters.status && filters.status !== 'all') {
        sales = sales.filter(sale => sale.status === filters.status);
      }

      if (filters.brand && filters.brand !== 'all') {
        sales = sales.filter(sale => sale.brand === filters.brand);
      }

      console.log(`Página ${page} carregada via RPC otimizada: ${sales.length} registros de ${totalCount} totais`);

      return {
        sales,
        totalCount: Number(totalCount),
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('Error in getSalesPaginated:', error);
      return {
        sales: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  },

  // Add missing getYesterday method for compatibility
  getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  },

  // Formatar data para exibição
  formatDateForDisplay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }
};
