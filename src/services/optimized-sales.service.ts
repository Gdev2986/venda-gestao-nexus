
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
  minuteStart?: string;
  minuteEnd?: string;
  terminals?: string[];
  paymentType?: string;
  status?: string;
  source?: string;
  brand?: string;
  searchCode?: string;
  minAmount?: number;
  maxAmount?: number;
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

export interface SalesAggregatedStats {
  total_sales: number;
  total_gross_amount: number;
  total_net_amount: number;
  office_commission: number;
}

export interface UniqueTerminal {
  terminal: string;
  usage_count: number;
}

// Cache para dados paginados
interface CacheEntry {
  data: PaginatedSalesResult;
  timestamp: number;
  filters: string;
}

class OptimizedSalesService {
  private cache = new Map<string, CacheEntry>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  private getCacheKey(page: number, pageSize: number, filters: SalesFilters): string {
    return `${page}-${pageSize}-${JSON.stringify(filters)}`;
  }

  private isValidCache(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheTimeout;
  }

  // Converte horário local brasileiro para UTC para o banco
  private convertBrazilianTimeToUTC(time: string): string {
    if (!time) return time;
    
    // Se já tem formato HH:MM, adiciona segundos
    const formattedTime = time.includes(':') ? (time.length === 5 ? time + ':00' : time) : time;
    
    // Cria uma data fictícia para hoje em horário brasileiro
    const today = new Date();
    const brazilDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Parse do horário
    const [hours, minutes, seconds = '00'] = formattedTime.split(':');
    brazilDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
    
    // Converte para UTC (adiciona 3 horas para compensar UTC-3)
    const utcDate = new Date(brazilDate.getTime() + (3 * 60 * 60 * 1000));
    
    return utcDate.toTimeString().slice(0, 8); // Retorna apenas HH:MM:SS
  }

  // Converte data UTC do banco para horário brasileiro
  private convertUTCToBrazilianTime(utcDateString: string): string {
    const utcDate = new Date(utcDateString);
    // Subtrai 3 horas para converter de UTC para horário brasileiro
    const brazilDate = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000));
    return brazilDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

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
  }

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
  }

  async getUniqueTerminals(searchTerm: string = ''): Promise<UniqueTerminal[]> {
    try {
      const { data, error } = await supabase.rpc('get_unique_terminals', {
        search_term: searchTerm
      });
      
      if (error) {
        console.error('Error getting unique terminals:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUniqueTerminals:', error);
      return [];
    }
  }

  async getSalesAggregatedStats(filters: SalesFilters): Promise<SalesAggregatedStats> {
    try {
      let hourStart = filters.hourStart;
      let hourEnd = filters.hourEnd;
      
      // Constrói o horário completo e converte para UTC
      if (filters.hourStart && filters.minuteStart) {
        const brazilianTime = `${filters.hourStart}:${filters.minuteStart}`;
        hourStart = this.convertBrazilianTimeToUTC(brazilianTime);
      } else if (filters.hourStart) {
        const brazilianTime = `${filters.hourStart}:00`;
        hourStart = this.convertBrazilianTimeToUTC(brazilianTime);
      }
      
      if (filters.hourEnd && filters.minuteEnd) {
        const brazilianTime = `${filters.hourEnd}:${filters.minuteEnd}`;
        hourEnd = this.convertBrazilianTimeToUTC(brazilianTime);
      } else if (filters.hourEnd) {
        const brazilianTime = `${filters.hourEnd}:59`;
        hourEnd = this.convertBrazilianTimeToUTC(brazilianTime);
      }

      console.log('Sending time filters to RPC:', { 
        original: { hourStart: filters.hourStart, hourEnd: filters.hourEnd },
        converted: { hourStart, hourEnd }
      });

      const { data, error } = await supabase.rpc('get_sales_aggregated_stats', {
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: hourStart || null,
        filter_hour_end: hourEnd || null,
        filter_terminals: filters.terminals || null,
        filter_payment_type: filters.paymentType || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error getting aggregated stats:', error);
        return {
          total_sales: 0,
          total_gross_amount: 0,
          total_net_amount: 0,
          office_commission: 0
        };
      }

      const result = data?.[0];
      return {
        total_sales: Number(result?.total_sales || 0),
        total_gross_amount: Number(result?.total_gross_amount || 0),
        total_net_amount: Number(result?.total_net_amount || 0),
        office_commission: Number(result?.office_commission || 0)
      };
    } catch (error) {
      console.error('Error in getSalesAggregatedStats:', error);
      return {
        total_sales: 0,
        total_gross_amount: 0,
        total_net_amount: 0,
        office_commission: 0
      };
    }
  }

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
  }

  async getSalesPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters: SalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      const cacheKey = this.getCacheKey(page, pageSize, filters);
      const cachedEntry = this.cache.get(cacheKey);
      
      // Verificar cache válido
      if (cachedEntry && this.isValidCache(cachedEntry)) {
        console.log(`Cache hit for page ${page}`);
        return cachedEntry.data;
      }

      console.log('Carregando vendas via RPC otimizada com filtros:', filters, 'página:', page);
      
      let hourStart = filters.hourStart;
      let hourEnd = filters.hourEnd;
      
      // Constrói o horário completo e converte para UTC
      if (filters.hourStart && filters.minuteStart) {
        const brazilianTime = `${filters.hourStart}:${filters.minuteStart}`;
        hourStart = this.convertBrazilianTimeToUTC(brazilianTime);
      } else if (filters.hourStart) {
        const brazilianTime = `${filters.hourStart}:00`;
        hourStart = this.convertBrazilianTimeToUTC(brazilianTime);
      }
      
      if (filters.hourEnd && filters.minuteEnd) {
        const brazilianTime = `${filters.hourEnd}:${filters.minuteEnd}`;
        hourEnd = this.convertBrazilianTimeToUTC(brazilianTime);
      } else if (filters.hourEnd) {
        const brazilianTime = `${filters.hourEnd}:59`;
        hourEnd = this.convertBrazilianTimeToUTC(brazilianTime);
      }

      console.log('Sending time filters to RPC:', { 
        original: { hourStart: filters.hourStart, hourEnd: filters.hourEnd },
        converted: { hourStart, hourEnd }
      });
      
      const { data: salesData, error } = await supabase.rpc('get_sales_optimized', {
        page_number: page,
        page_size: pageSize,
        filter_date_start: filters.dateStart || null,
        filter_date_end: filters.dateEnd || null,
        filter_hour_start: hourStart || null,
        filter_hour_end: hourEnd || null,
        filter_terminals: filters.terminals || null,
        filter_payment_type: filters.paymentType || null,
        filter_source: filters.source || null
      });

      if (error) {
        console.error('Error in getSalesPaginated RPC:', error);
        throw error;
      }

      if (!salesData || salesData.length === 0) {
        const result = {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
        
        // Cache resultado vazio
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          filters: JSON.stringify(filters)
        });
        
        return result;
      }

      const totalCount = salesData[0]?.total_count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      let sales: NormalizedSale[] = salesData.map((sale: any) => {
        // Converte a data UTC do banco para horário brasileiro para exibição
        const formattedDate = this.convertUTCToBrazilianTime(sale.date);

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

      // Aplicar filtros frontend que não foram aplicados no backend
      if (filters.status && filters.status !== 'all') {
        sales = sales.filter(sale => sale.status === filters.status);
      }

      if (filters.brand && filters.brand !== 'all') {
        sales = sales.filter(sale => sale.brand === filters.brand);
      }

      if (filters.searchCode) {
        sales = sales.filter(sale => 
          sale.id?.toLowerCase().includes(filters.searchCode!.toLowerCase())
        );
      }

      if (filters.minAmount) {
        sales = sales.filter(sale => sale.gross_amount >= filters.minAmount!);
      }

      if (filters.maxAmount) {
        sales = sales.filter(sale => sale.gross_amount <= filters.maxAmount!);
      }

      const result = {
        sales,
        totalCount: Number(totalCount),
        totalPages,
        currentPage: page
      };

      // Cache o resultado
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        filters: JSON.stringify(filters)
      });

      console.log(`Página ${page} carregada via RPC otimizada: ${sales.length} registros de ${totalCount} totais`);
      return result;

    } catch (error) {
      console.error('Error in getSalesPaginated:', error);
      return {
        sales: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  }

  // Limpar cache quando filtros mudam
  clearCache(): void {
    this.cache.clear();
    console.log('Cache limpo');
  }

  // Limpar cache de páginas específicas quando filtros mudam
  clearCacheForFilters(filters: SalesFilters): void {
    const filterString = JSON.stringify(filters);
    for (const [key, entry] of this.cache.entries()) {
      if (entry.filters === filterString) {
        this.cache.delete(key);
      }
    }
  }

  getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  formatDateForDisplay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }
}

export const optimizedSalesService = new OptimizedSalesService();
