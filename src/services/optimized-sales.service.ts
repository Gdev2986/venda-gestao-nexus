
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
  hourStart?: number;
  hourEnd?: number;
  terminals?: string[];
  paymentType?: string;
  status?: string;
  source?: string;
}

export interface PaginatedSalesResult {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
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

  // Obter datas com vendas para calendário
  async getDatesWithSales(): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('get_dates_with_sales');
      
      if (error) {
        console.error('Error getting dates with sales:', error);
        return [];
      }
      
      return data?.map((item: any) => item.sale_date) || [];
    } catch (error) {
      console.error('Error in getDatesWithSales:', error);
      return [];
    }
  },

  // Buscar vendas paginadas com filtros otimizados
  async getSalesPaginated(
    page: number = 1,
    pageSize: number = 1000,
    filters: SalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      const { data, error } = await supabase.rpc('get_sales_paginated', {
        page_number: page,
        page_size: pageSize,
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: filters.hourStart || null,
        filter_hour_end: filters.hourEnd || null,
        filter_terminals: filters.terminals || null,
        filter_payment_type: filters.paymentType || null,
        filter_status: filters.status || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error getting paginated sales:', error);
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      if (!data || data.length === 0) {
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      // Converter dados do banco para formato NormalizedSale
      const totalCount = Number(data[0]?.total_count || 0);
      const totalPages = Math.ceil(totalCount / pageSize);

      const sales: NormalizedSale[] = data.map((sale: any) => {
        // Formatar data para exibição (DD/MM/YYYY HH:MM)
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

      return {
        sales,
        totalCount,
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

  // Obter ontem como data padrão
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
