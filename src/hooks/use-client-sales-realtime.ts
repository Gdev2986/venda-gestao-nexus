
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { clientSalesOptimizedService, ClientSalesStats } from "@/services/client-sales-optimized.service";

interface ExtendedSale {
  id: string;
  code: string;
  terminal: string;
  transaction_date: string;
  gross_amount: number;
  net_amount: number;
  tax_amount: number;
  tax_rate: number;
  payment_type: string;
  installments: number;
}

export const useClientSalesRealtime = (startDate?: Date, endDate?: Date) => {
  const [sales, setSales] = useState<ExtendedSale[]>([]);
  const [stats, setStats] = useState<ClientSalesStats>({
    total_transactions: 0,
    total_gross: 0,
    total_net: 0,
    total_taxes: 0,
    payment_method_stats: {}
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar client_id do usuário
  const loadClientId = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (clientAccess) {
        setClientId(clientAccess.client_id);
      }
    } catch (error) {
      console.error('Erro ao carregar client_id:', error);
    }
  }, [user?.id]);

  // Carregar vendas e estatísticas usando o novo serviço
  const loadData = useCallback(async (page: number = 1) => {
    if (!clientId) return;

    setIsLoading(true);
    setError(null);

    try {
      const dateStart = startDate?.toISOString().split('T')[0];
      const dateEnd = endDate?.toISOString().split('T')[0];

      // Buscar vendas e estatísticas em paralelo
      const [salesResult, statsResult] = await Promise.all([
        clientSalesOptimizedService.getClientSalesWithTaxes(
          clientId,
          dateStart,
          dateEnd,
          page,
          1000
        ),
        clientSalesOptimizedService.getClientSalesStats(
          clientId,
          dateStart,
          dateEnd
        )
      ]);

      setSales(salesResult.sales);
      setStats(statsResult);
      setTotalCount(salesResult.totalCount);
      setTotalPages(salesResult.totalPages);
      setCurrentPage(page);

      console.log('Client sales loaded:', {
        salesCount: salesResult.sales.length,
        stats: statsResult
      });

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do cliente');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, startDate, endDate, toast]);

  // Configurar subscriptions de tempo real
  useEffect(() => {
    if (!clientId) return;

    console.log('Setting up realtime subscriptions for client:', clientId);

    // Subscription para vendas
    const salesChannel = supabase
      .channel('client-sales-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          console.log('New sale detected:', payload);
          // Recarregar dados quando nova venda for inserida
          loadData(currentPage);
          
          toast({
            title: "Nova Venda Registrada",
            description: `Nova venda no valor de R$ ${payload.new.gross_amount}`,
          });
        }
      )
      .subscribe();

    // Subscription para mudanças de saldo
    const balanceChannel = supabase
      .channel('client-balance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `id=eq.${clientId}`
        },
        (payload) => {
          console.log('Client balance changed:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new.balance !== payload.old?.balance) {
            toast({
              title: "Saldo Atualizado",
              description: `Novo saldo: R$ ${Number(payload.new.balance).toFixed(2)}`,
            });
          }
        }
      )
      .subscribe();

    // Subscription para mudanças de saldo detalhadas
    const balanceChangesChannel = supabase
      .channel('client-balance-changes-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'balance_changes',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          console.log('Balance change recorded:', payload);
          
          if (payload.new.reason?.includes('Venda automática')) {
            toast({
              title: "Crédito Adicionado",
              description: `R$ ${Number(payload.new.amount_changed).toFixed(2)} adicionado ao seu saldo`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salesChannel);
      supabase.removeChannel(balanceChannel);
      supabase.removeChannel(balanceChangesChannel);
    };
  }, [clientId, currentPage, loadData, toast]);

  // Mudança de página
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    loadData(page);
  }, [loadData]);

  // Carregar client_id inicialmente
  useEffect(() => {
    if (user?.id) {
      loadClientId();
    }
  }, [user?.id, loadClientId]);

  // Carregar dados quando clientId ou filtros mudarem
  useEffect(() => {
    if (clientId) {
      loadData(1);
    }
  }, [clientId, startDate, endDate, loadData]);

  return {
    sales,
    stats,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    changePage,
    clientId
  };
};
