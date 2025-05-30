
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { optimizedSalesService, SalesFilters, PaginatedSalesResult, SalesDateRange, SalesSummary, SalesAggregatedStats } from "@/services/optimized-sales.service";

interface PeriodStats {
  totalSales: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  officeCommission: number;
}

export const useOptimizedSales = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salesData, setSalesData] = useState<PaginatedSalesResult>({
    sales: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [periodStats, setPeriodStats] = useState<PeriodStats>({
    totalSales: 0,
    totalGrossAmount: 0,
    totalNetAmount: 0,
    officeCommission: 0
  });
  const [dateRange, setDateRange] = useState<SalesDateRange | null>(null);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  // Set default filter to yesterday
  const [filters, setFilters] = useState<SalesFilters>({
    dateStart: optimizedSalesService.getYesterday(),
    dateEnd: optimizedSalesService.getYesterday()
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Cache para evitar recarregamentos desnecessários
  const dataCache = useRef<Map<string, PaginatedSalesResult>>(new Map());
  const lastFiltersRef = useRef<string>('');
  
  const { toast } = useToast();

  // Gerar chave de cache baseada nos filtros e página
  const getCacheKey = useCallback((page: number, activeFilters: SalesFilters) => {
    return `${JSON.stringify(activeFilters)}_page_${page}`;
  }, []);

  // Verificar se os filtros mudaram
  const filtersChanged = useCallback((newFilters: SalesFilters) => {
    const newFiltersStr = JSON.stringify(newFilters);
    const changed = lastFiltersRef.current !== newFiltersStr;
    lastFiltersRef.current = newFiltersStr;
    return changed;
  }, []);

  // Carregar metadados iniciais
  const loadMetadata = useCallback(async () => {
    try {
      const [dateRangeData, datesData, summaryData] = await Promise.all([
        optimizedSalesService.getDateRange(),
        optimizedSalesService.getDatesWithSales(),
        optimizedSalesService.getSalesSummary()
      ]);

      setDateRange(dateRangeData);
      setAvailableDates(datesData);
      setSalesSummary(summaryData);

      console.log('Metadados carregados:', { 
        dateRange: dateRangeData, 
        availableDates: datesData.length,
        summary: summaryData 
      });
    } catch (error) {
      console.error('Error loading metadata:', error);
      toast({
        title: "Erro ao carregar metadados",
        description: "Não foi possível carregar informações de datas.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Carregar estatísticas do período usando nova função agregada
  const loadPeriodStats = useCallback(async (activeFilters: SalesFilters) => {
    try {
      console.log('Loading period stats with filters:', activeFilters);
      
      const stats = await optimizedSalesService.getSalesAggregatedStats(activeFilters);
      
      setPeriodStats({
        totalSales: stats.total_sales,
        totalGrossAmount: stats.total_gross_amount,
        totalNetAmount: stats.total_net_amount,
        officeCommission: stats.office_commission
      });

      console.log('Period stats loaded:', stats);
    } catch (error) {
      console.error('Error loading period stats:', error);
      setPeriodStats({
        totalSales: 0,
        totalGrossAmount: 0,
        totalNetAmount: 0,
        officeCommission: 0
      });
    }
  }, []);

  // Carregar vendas com cache otimizado
  const loadSales = useCallback(async (page: number = 1, newFilters?: SalesFilters) => {
    const activeFilters = newFilters || filters;
    const cacheKey = getCacheKey(page, activeFilters);
    
    // Verificar cache se os filtros não mudaram
    if (!filtersChanged(activeFilters) && dataCache.current.has(cacheKey)) {
      const cachedData = dataCache.current.get(cacheKey)!;
      setSalesData(cachedData);
      setCurrentPage(page);
      console.log(`Loaded from cache - page ${page}: ${cachedData.sales.length} sales`);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Loading sales via optimized RPC with filters:', activeFilters, 'page:', page);
      
      const result = await optimizedSalesService.getSalesPaginated(page, 10, activeFilters);
      
      // Armazenar no cache
      dataCache.current.set(cacheKey, result);
      
      setSalesData(result);
      setCurrentPage(page);

      // Carregar estatísticas do período quando os filtros mudarem
      if (newFilters || page === 1) {
        await loadPeriodStats(activeFilters);
      }

      console.log(`Loaded page ${page} via optimized RPC: ${result.sales.length} sales, total: ${result.totalCount}`);

      if (result.totalCount > 0) {
        toast({
          title: "Dados carregados",
          description: `${result.totalCount.toLocaleString('pt-BR')} registros encontrados (página ${page} de ${result.totalPages}).`
        });
      } else {
        toast({
          title: "Nenhum registro encontrado",
          description: "Tente ajustar os filtros para encontrar registros."
        });
      }
    } catch (error) {
      console.error('Error loading sales via optimized RPC:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: "Não foi possível carregar os dados de vendas.",
        variant: "destructive"
      });
      setSalesData({
        sales: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      });
      setPeriodStats({
        totalSales: 0,
        totalGrossAmount: 0,
        totalNetAmount: 0,
        officeCommission: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast, loadPeriodStats, getCacheKey, filtersChanged]);

  // Efeito inicial para carregar metadados
  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Efeito para carregar vendas quando metadados estão prontos
  useEffect(() => {
    if (salesSummary) {
      console.log('Metadata loaded, loading sales with yesterday filter');
      loadSales(1, {
        dateStart: optimizedSalesService.getYesterday(),
        dateEnd: optimizedSalesService.getYesterday()
      });
    }
  }, [salesSummary]);

  // Função para atualizar filtros - limpa cache quando filtros mudam
  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    console.log('Updating filters:', newFilters);
    const updatedFilters = { ...filters, ...newFilters };
    
    // Limpar cache quando filtros mudam
    dataCache.current.clear();
    
    setFilters(updatedFilters);
    setCurrentPage(1);
    loadSales(1, updatedFilters);
  }, [filters, loadSales]);

  // Função para mudar de página - usar cache quando possível
  const changePage = useCallback((page: number) => {
    console.log('Changing to page:', page, 'total pages:', salesData.totalPages);
    if (page >= 1 && page <= salesData.totalPages) {
      loadSales(page);
    }
  }, [loadSales, salesData.totalPages]);

  // Função para resetar filtros - limpa cache
  const resetFilters = useCallback(() => {
    console.log('Resetting filters to load all data');
    dataCache.current.clear();
    setFilters({});
    setCurrentPage(1);
    loadSales(1, {});
  }, [loadSales]);

  // Função para refresh manual - limpa cache
  const refreshSales = useCallback(() => {
    dataCache.current.clear();
    loadMetadata();
    loadSales(currentPage);
  }, [loadMetadata, loadSales, currentPage]);

  return {
    // Data
    sales: salesData.sales,
    totalCount: salesData.totalCount,
    totalPages: salesData.totalPages,
    currentPage,
    dateRange,
    availableDates,
    filters,
    isLoading,
    salesSummary,
    periodStats,

    // Actions
    updateFilters,
    changePage,
    resetFilters,
    refreshSales
  };
};
