
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { optimizedSalesService, SalesFilters, PaginatedSalesResult, SalesDateRange, SalesSummary } from "@/services/optimized-sales.service";

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
  
  const { toast } = useToast();

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

  // Carregar estatísticas do período completo
  const loadPeriodStats = useCallback(async (activeFilters: SalesFilters) => {
    try {
      console.log('Loading period stats with filters:', activeFilters);
      
      // Carregar todas as vendas do período (sem paginação) para calcular estatísticas
      const allSalesResult = await optimizedSalesService.getSalesPaginated(1, 999999, activeFilters);
      
      const totalSales = allSalesResult.totalCount;
      const totalGrossAmount = allSalesResult.sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
      const totalNetAmount = totalGrossAmount * 0.97; // 97% do valor bruto
      const officeCommission = totalGrossAmount * 0.015; // 1.5% do valor bruto

      setPeriodStats({
        totalSales,
        totalGrossAmount,
        totalNetAmount,
        officeCommission
      });

      console.log('Period stats loaded:', { totalSales, totalGrossAmount, totalNetAmount, officeCommission });
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

  // Carregar vendas usando paginação real via RPC otimizada
  const loadSales = useCallback(async (page: number = 1, newFilters?: SalesFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = newFilters || filters;
      console.log('Loading sales via optimized RPC with filters:', activeFilters, 'page:', page);
      
      const result = await optimizedSalesService.getSalesPaginated(page, 100, activeFilters);
      
      setSalesData(result);
      setCurrentPage(page);

      // Carregar estatísticas do período completo quando os filtros mudarem
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
  }, [filters, toast, loadPeriodStats]);

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

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    console.log('Updating filters:', newFilters);
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    loadSales(1, updatedFilters);
  }, [filters, loadSales]);

  // Função para mudar de página usando RPC otimizada
  const changePage = useCallback((page: number) => {
    console.log('Changing to page via optimized RPC:', page, 'total pages:', salesData.totalPages);
    if (page >= 1 && page <= salesData.totalPages) {
      loadSales(page);
    }
  }, [loadSales, salesData.totalPages]);

  // Função para resetar filtros (carregar todos os dados)
  const resetFilters = useCallback(() => {
    console.log('Resetting filters to load all data');
    setFilters({});
    setCurrentPage(1);
    loadSales(1, {});
  }, [loadSales]);

  // Função para refresh manual
  const refreshSales = useCallback(() => {
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
