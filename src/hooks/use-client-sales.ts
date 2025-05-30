
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clientSalesService, ClientSalesFilters } from '@/services/client-sales.service';
import { NormalizedSale } from '@/utils/sales-processor';
import { SalesDateRange } from '@/services/optimized-sales.service';

export interface ClientSalesStats {
  totalGross: number;
  totalNet: number;
  totalTransactions: number;
  avgTicket: number;
}

export const useClientSales = (startDate?: Date, endDate?: Date) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sales, setSales] = useState<NormalizedSale[]>([]);
  const [stats, setStats] = useState<ClientSalesStats>({
    totalGross: 0,
    totalNet: 0,
    totalTransactions: 0,
    avgTicket: 0
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<SalesDateRange | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  // Get client ID for current user
  const fetchClientId = useCallback(async () => {
    if (!user?.id) {
      console.log('useClientSales: No user ID available');
      return null;
    }

    try {
      console.log('useClientSales: Fetching client access for user:', user.id);
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (accessError) {
        console.error('useClientSales: Error fetching client access:', accessError);
        throw accessError;
      }
      
      if (!clientAccess) {
        throw new Error('Cliente não encontrado');
      }

      console.log('useClientSales: Found client ID:', clientAccess.client_id);
      return clientAccess.client_id;
    } catch (err) {
      console.error('useClientSales: Error in fetchClientId:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar cliente');
      return null;
    }
  }, [user?.id]);

  // Load metadata
  const loadMetadata = useCallback(async () => {
    try {
      const [dateRangeData, datesData] = await Promise.all([
        clientSalesService.getDateRange(),
        clientSalesService.getDatesWithSales()
      ]);

      setDateRange(dateRangeData);
      setAvailableDates(datesData);
    } catch (error) {
      console.error('useClientSales: Error loading metadata:', error);
    }
  }, []);

  // Load sales using optimized service
  const loadSales = useCallback(async (page: number = 1) => {
    if (!clientId) {
      console.log('useClientSales: No client ID, skipping sales fetch');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build filters from date range
      const filters: ClientSalesFilters = {};
      
      if (startDate) {
        filters.dateStart = startDate.toISOString().split('T')[0];
      }
      
      if (endDate) {
        filters.dateEnd = endDate.toISOString().split('T')[0];
      }

      console.log('useClientSales: Loading sales with filters:', filters, 'page:', page);
      
      // Use client sales service
      const result = await clientSalesService.getClientSalesPaginated(
        clientId,
        page,
        1000,
        filters
      );

      setSales(result.sales);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);

      // Calculate stats from current page results
      const totalGross = result.sales.reduce((sum, sale) => sum + Number(sale.gross_amount), 0);
      const totalNet = result.sales.reduce((sum, sale) => sum + Number(sale.net_amount), 0);
      const totalTransactions = result.sales.length;
      const avgTicket = totalTransactions > 0 ? totalGross / totalTransactions : 0;

      setStats({
        totalGross,
        totalNet,
        totalTransactions,
        avgTicket
      });

      console.log('useClientSales: Loaded sales successfully:', {
        salesCount: result.sales.length,
        totalCount: result.totalCount,
        stats: { totalGross, totalNet, totalTransactions, avgTicket }
      });

      if (result.totalCount > 0) {
        toast({
          title: "Vendas carregadas",
          description: `${result.totalCount} vendas encontradas.`
        });
      }

    } catch (err) {
      console.error('useClientSales: Error loading sales:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
      setSales([]);
      setStats({ totalGross: 0, totalNet: 0, totalTransactions: 0, avgTicket: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, startDate, endDate, toast]);

  // Change page
  const changePage = useCallback((page: number) => {
    console.log('useClientSales: Changing to page:', page);
    if (page >= 1 && page <= totalPages) {
      loadSales(page);
    }
  }, [loadSales, totalPages]);

  // Refresh
  const refetch = useCallback(() => {
    console.log('useClientSales: Manual refresh requested');
    loadMetadata();
    loadSales(1);
  }, [loadMetadata, loadSales]);

  // Initialize client ID
  useEffect(() => {
    if (user?.id && !clientId) {
      fetchClientId().then(setClientId);
    }
  }, [user?.id, clientId, fetchClientId]);

  // Load metadata on mount
  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Load sales when dependencies change
  useEffect(() => {
    if (clientId && (startDate || endDate || !startDate && !endDate)) {
      console.log('useClientSales: Dependencies changed, loading sales');
      loadSales(1);
    }
  }, [clientId, startDate, endDate, loadSales]);

  return {
    // Data
    sales,
    stats,
    totalCount,
    totalPages,
    currentPage,
    dateRange,
    availableDates,
    isLoading,
    error,

    // Actions
    changePage,
    refetch
  };
};
