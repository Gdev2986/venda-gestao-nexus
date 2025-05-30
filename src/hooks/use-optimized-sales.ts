
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { optimizedSalesService, SalesFilters, PaginatedSalesResult, SalesDateRange, SalesSummary } from "@/services/optimized-sales.service";

export const useOptimizedSales = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salesData, setSalesData] = useState<PaginatedSalesResult>({
    sales: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [dateRange, setDateRange] = useState<SalesDateRange | null>(null);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [filters, setFilters] = useState<SalesFilters>({});
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

  // Carregar vendas usando paginação real via RPC otimizada
  const loadSales = useCallback(async (page: number = 1, newFilters?: SalesFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = newFilters || filters;
      console.log('Loading sales via optimized RPC with filters:', activeFilters, 'page:', page);
      
      const result = await optimizedSalesService.getSalesPaginated(page, 1000, activeFilters);
      
      setSalesData(result);
      setCurrentPage(page);

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
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  // Efeito inicial para carregar metadados
  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Efeito para carregar vendas quando metadados estão prontos
  useEffect(() => {
    if (salesSummary) {
      console.log('Metadata loaded, loading all sales without date filter');
      loadSales(1, {}); // Carregar sem filtros para mostrar todos os dados
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

    // Actions
    updateFilters,
    changePage,
    resetFilters,
    refreshSales
  };
};
