
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale } from "@/utils/sales-processor";
import { optimizedSalesService, SalesFilters, PaginatedSalesResult, SalesDateRange } from "@/services/optimized-sales.service";

export const useOptimizedSales = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salesData, setSalesData] = useState<PaginatedSalesResult>({
    sales: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [dateRange, setDateRange] = useState<SalesDateRange | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [filters, setFilters] = useState<SalesFilters>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { toast } = useToast();

  // Carregar metadados iniciais
  const loadMetadata = useCallback(async () => {
    try {
      const [dateRangeData, datesData] = await Promise.all([
        optimizedSalesService.getDateRange(),
        optimizedSalesService.getDatesWithSales()
      ]);

      setDateRange(dateRangeData);
      setAvailableDates(datesData);

      // Configurar filtro padrão para ontem se ainda não foi definido
      if (!filters.dateStart && !filters.dateEnd && dateRangeData) {
        const yesterday = optimizedSalesService.getYesterday();
        setFilters(prev => ({
          ...prev,
          dateStart: yesterday,
          dateEnd: yesterday
        }));
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
      toast({
        title: "Erro ao carregar metadados",
        description: "Não foi possível carregar informações de datas.",
        variant: "destructive"
      });
    }
  }, [filters.dateStart, filters.dateEnd, toast]);

  // Carregar vendas com filtros e paginação
  const loadSales = useCallback(async (page: number = 1, newFilters?: SalesFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = newFilters || filters;
      const result = await optimizedSalesService.getSalesPaginated(page, 1000, activeFilters);
      
      setSalesData(result);
      setCurrentPage(page);

      if (result.totalCount > 0) {
        toast({
          title: "Dados carregados",
          description: `${result.totalCount} registros encontrados (página ${page} de ${result.totalPages}).`
        });
      }
    } catch (error) {
      console.error('Error loading sales:', error);
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
  }, []);

  // Efeito para carregar vendas quando filtros mudam
  useEffect(() => {
    if (filters.dateStart || filters.dateEnd || Object.keys(filters).length > 0) {
      loadSales(1, filters);
    }
  }, [filters]);

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset para primeira página
  }, []);

  // Função para mudar de página
  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= salesData.totalPages) {
      loadSales(page);
    }
  }, [loadSales, salesData.totalPages]);

  // Função para resetar filtros
  const resetFilters = useCallback(() => {
    const yesterday = optimizedSalesService.getYesterday();
    setFilters({
      dateStart: yesterday,
      dateEnd: yesterday
    });
    setCurrentPage(1);
  }, []);

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

    // Actions
    updateFilters,
    changePage,
    resetFilters,
    refreshSales
  };
};
