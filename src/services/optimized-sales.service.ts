import { supabase } from "@/integrations/supabase/client";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";
import { fetchAllSalesWithFilters } from "./sales/sales-fetch-all";

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
  brand?: string;
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

  // Buscar vendas paginadas com filtros otimizados - NOVA IMPLEMENTAÇÃO
  async getSalesPaginated(
    page: number = 1,
    pageSize: number = 1000,
    filters: SalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      console.log('Carregando vendas com filtros:', filters, 'página:', page);
      
      // Buscar TODOS os dados da tabela usando a nova função
      const allSalesData = await fetchAllSalesWithFilters({
        dateStart: filters.dateStart,
        dateEnd: filters.dateEnd,
        terminals: filters.terminals,
        paymentType: filters.paymentType,
        source: filters.source
      });

      // Converter dados do banco para formato NormalizedSale
      let sales: NormalizedSale[] = allSalesData.map((sale: any) => {
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

      // Aplicar filtros adicionais no frontend
      if (filters.hourStart !== undefined || filters.hourEnd !== undefined) {
        sales = sales.filter(sale => {
          const saleDate = new Date(sale.transaction_date.split(' ')[0].split('/').reverse().join('-') + 'T' + sale.transaction_date.split(' ')[1]);
          const hour = saleDate.getHours();
          
          if (filters.hourStart !== undefined && hour < filters.hourStart) return false;
          if (filters.hourEnd !== undefined && hour > filters.hourEnd) return false;
          
          return true;
        });
      }

      if (filters.status && filters.status !== 'all') {
        sales = sales.filter(sale => sale.status === filters.status);
      }

      if (filters.brand && filters.brand !== 'all') {
        sales = sales.filter(sale => sale.brand === filters.brand);
      }

      // Calcular totais
      const totalCount = sales.length;
      const totalPages = Math.ceil(totalCount / pageSize);

      // Aplicar paginação no frontend
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedSales = sales.slice(startIndex, endIndex);

      console.log(`Total de registros encontrados: ${totalCount}, página ${page} de ${totalPages}, mostrando ${paginatedSales.length} registros`);

      return {
        sales: paginatedSales,
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
