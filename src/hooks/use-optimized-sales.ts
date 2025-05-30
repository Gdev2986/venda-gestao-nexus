
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
  const [filters, setFilters] = useState<SalesFilters>({
    dateStart: optimizedSalesService.getYesterday(),
    dateEnd: optimizedSalesService.getYesterday()
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Ref para controlar se os filtros mudaram
  const previousFiltersRef = useRef<string>('');
  
  const { toast } = useToast();

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

  const loadSales = useCallback(async (page: number = 1, newFilters?: SalesFilters, forceReload: boolean = false) => {
    const activeFilters = newFilters || filters;
    const currentFiltersString = JSON.stringify(activeFilters);
    const filtersChanged = currentFiltersString !== previousFiltersRef.current;
    
    // Se os filtros mudaram, limpar cache e começar do zero
    if (filtersChanged || forceReload) {
      console.log('Filtros mudaram, limpando cache');
      optimizedSalesService.clearCache();
      setIsLoading(true);
      previousFiltersRef.current = currentFiltersString;
    }
    
    // Para mudanças de página com mesmos filtros, não mostrar loading
    if (!filtersChanged && !forceReload && page !== 1) {
      console.log('Mudança de página sem reload, mantendo estado');
    } else {
      setIsLoading(true);
    }
    
    try {
      console.log('Loading sales via optimized RPC with filters:', activeFilters, 'page:', page);
      
      const result = await optimizedSalesService.getSalesPaginated(page, 10, activeFilters);
      
      setSalesData(result);
      setCurrentPage(page);

      // Carregar estatísticas do período apenas quando os filtros mudarem ou forçar reload
      if (filtersChanged || forceReload || page === 1) {
        await loadPeriodStats(activeFilters);
      }

      console.log(`Loaded page ${page} via optimized RPC: ${result.sales.length} sales, total: ${result.totalCount}`);

      if (result.totalCount > 0 && (filtersChanged || forceReload)) {
        toast({
          title: "Dados carregados",
          description: `${result.totalCount.toLocaleString('pt-BR')} registros encontrados (página ${page} de ${result.totalPages}).`
        });
      } else if (result.totalCount === 0 && (filtersChanged || forceReload)) {
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
  }, [filters, toast, loadPeriodStats]);

  // Efeito inicial para carregar metadados
  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Efeito para carregar vendas quando metadados estão prontos
  useEffect(() => {
    if (salesSummary) {
      console.log('Metadata loaded, loading sales with yesterday filter');
      const initialFilters = {
        dateStart: optimizedSalesService.getYesterday(),
        dateEnd: optimizedSalesService.getYesterday()
      };
      setFilters(initialFilters);
      loadSales(1, initialFilters, true);
    }
  }, [salesSummary]);

  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    console.log('Updating filters:', newFilters);
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    loadSales(1, updatedFilters, true);
  }, [filters, loadSales]);

  const changePage = useCallback((page: number) => {
    console.log('Changing to page via optimized RPC:', page, 'total pages:', salesData.totalPages);
    if (page >= 1 && page <= salesData.totalPages && page !== currentPage) {
      loadSales(page, filters, false); // false = não forçar reload completo
    }
  }, [loadSales, salesData.totalPages, currentPage, filters]);

  const resetFilters = useCallback(() => {
    console.log('Resetting filters to load all data');
    const emptyFilters = {};
    setFilters(emptyFilters);
    setCurrentPage(1);
    loadSales(1, emptyFilters, true);
  }, [loadSales]);

  const refreshSales = useCallback(() => {
    optimizedSalesService.clearCache();
    loadMetadata();
    loadSales(currentPage, filters, true);
  }, [loadMetadata, loadSales, currentPage, filters]);

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
