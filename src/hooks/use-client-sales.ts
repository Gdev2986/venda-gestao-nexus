
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { clientSalesService, ClientSalesFilters } from "@/services/client-sales.service";
import { TaxBlocksService } from "@/services/tax-blocks.service";
import { NormalizedSale } from "@/utils/sales-processor";

interface ClientSalesStats {
  totalTransactions: number;
  totalGross: number;
  totalNet: number;
  totalTaxes: number;
  byPaymentMethod: {
    [key: string]: {
      gross: number;
      net: number;
      taxes: number;
      count: number;
    }
  };
}

export const useClientSales = (startDate?: Date, endDate?: Date) => {
  const [sales, setSales] = useState<NormalizedSale[]>([]);
  const [stats, setStats] = useState<ClientSalesStats>({
    totalTransactions: 0,
    totalGross: 0,
    totalNet: 0,
    totalTaxes: 0,
    byPaymentMethod: {}
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientTaxBlock, setClientTaxBlock] = useState<any>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar bloco de taxas do cliente
  const loadClientTaxBlock = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (!clientAccess) return;

      const taxBlock = await TaxBlocksService.getClientTaxBlock(clientAccess.client_id);
      setClientTaxBlock(taxBlock);
    } catch (error) {
      console.error('Erro ao carregar bloco de taxas:', error);
    }
  }, [user?.id]);

  // Calcular valor líquido baseado na taxa
  const calculateNetValue = useCallback((sale: NormalizedSale): { net: number; tax: number; rate: number } => {
    if (!clientTaxBlock?.rates) {
      return { net: sale.gross_amount, tax: 0, rate: 0 };
    }

    // Mapear tipo de pagamento para encontrar a taxa
    let paymentMethod = '';
    if (sale.payment_type === 'PIX' || sale.payment_type === 'Pix') {
      paymentMethod = 'PIX';
    } else if (sale.payment_type === 'Cartão de Débito' || sale.payment_type === 'DEBIT') {
      paymentMethod = 'DEBIT';
    } else if (sale.payment_type === 'Cartão de Crédito' || sale.payment_type === 'CREDIT') {
      paymentMethod = 'CREDIT';
    }

    const taxRate = clientTaxBlock.rates.find((rate: any) => 
      rate.payment_method === paymentMethod && 
      rate.installment === (sale.installments || 1)
    );

    if (!taxRate) {
      return { net: sale.gross_amount, tax: 0, rate: 0 };
    }

    const rateValue = taxRate.final_rate / 100;
    const taxAmount = sale.gross_amount * rateValue;
    const netAmount = sale.gross_amount - taxAmount;

    return { 
      net: netAmount, 
      tax: taxAmount, 
      rate: taxRate.final_rate 
    };
  }, [clientTaxBlock]);

  // Carregar vendas com cálculos de taxa
  const loadSales = useCallback(async (page: number = 1) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Buscar client_id
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (!clientAccess) {
        setError('Cliente não encontrado');
        return;
      }

      // Preparar filtros
      const filters: ClientSalesFilters = {};
      if (startDate) {
        filters.dateStart = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        filters.dateEnd = endDate.toISOString().split('T')[0];
      }

      // Buscar vendas
      const result = await clientSalesService.getClientSalesPaginated(
        clientAccess.client_id,
        page,
        1000, // Buscar muitos para cálculos
        filters
      );

      // Calcular valores líquidos e estatísticas
      const salesWithNet = result.sales.map(sale => {
        const { net, tax, rate } = calculateNetValue(sale);
        return {
          ...sale,
          net_amount: net,
          tax_amount: tax,
          tax_rate: rate
        };
      });

      // Calcular estatísticas agregadas
      const newStats: ClientSalesStats = {
        totalTransactions: result.totalCount,
        totalGross: 0,
        totalNet: 0,
        totalTaxes: 0,
        byPaymentMethod: {}
      };

      salesWithNet.forEach(sale => {
        newStats.totalGross += sale.gross_amount;
        newStats.totalNet += sale.net_amount;
        newStats.totalTaxes += sale.tax_amount || 0;

        const method = sale.payment_type;
        if (!newStats.byPaymentMethod[method]) {
          newStats.byPaymentMethod[method] = {
            gross: 0,
            net: 0,
            taxes: 0,
            count: 0
          };
        }

        newStats.byPaymentMethod[method].gross += sale.gross_amount;
        newStats.byPaymentMethod[method].net += sale.net_amount;
        newStats.byPaymentMethod[method].taxes += sale.tax_amount || 0;
        newStats.byPaymentMethod[method].count += 1;
      });

      setSales(salesWithNet);
      setStats(newStats);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentPage(page);

      console.log('Client sales loaded:', {
        salesCount: salesWithNet.length,
        totalGross: newStats.totalGross,
        totalNet: newStats.totalNet,
        totalTaxes: newStats.totalTaxes
      });

    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      setError('Erro ao carregar vendas do cliente');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, startDate, endDate, calculateNetValue, toast]);

  // Mudança de página
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    loadSales(page);
  }, [loadSales]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      loadClientTaxBlock();
    }
  }, [user?.id, loadClientTaxBlock]);

  useEffect(() => {
    if (user?.id && clientTaxBlock) {
      loadSales(1);
    }
  }, [user?.id, clientTaxBlock, startDate, endDate, loadSales]);

  return {
    sales,
    stats,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    changePage,
    clientTaxBlock
  };
};
