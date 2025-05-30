
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { PaymentMethod } from '@/types';

export interface ClientSale {
  id: string;
  code: string;
  terminal: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: PaymentMethod;
  installments?: number;
  machine_id: string;
}

export interface ClientSalesStats {
  totalGross: number;
  totalNet: number;
  totalTransactions: number;
  avgTicket: number;
}

export const useClientSales = (startDate?: Date, endDate?: Date) => {
  const { user } = useAuth();
  const [sales, setSales] = useState<ClientSale[]>([]);
  const [stats, setStats] = useState<ClientSalesStats>({
    totalGross: 0,
    totalNet: 0,
    totalTransactions: 0,
    avgTicket: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSales = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get client ID for the user
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (accessError) throw accessError;
      if (!clientAccess) throw new Error('Cliente não encontrado');

      // Use the existing function to get client sales with transfers
      let query = supabase.rpc('get_client_sales_with_transfers', {
        p_client_id: clientAccess.client_id,
        p_start_date: startDate?.toISOString(),
        p_end_date: endDate?.toISOString()
      });

      const { data, error: salesError } = await query;

      if (salesError) throw salesError;

      const formattedSales: ClientSale[] = (data || []).map((sale: any) => ({
        id: sale.sale_id,
        code: sale.code,
        terminal: sale.terminal,
        date: sale.date,
        gross_amount: sale.gross_amount,
        net_amount: sale.net_amount,
        payment_method: sale.payment_method as PaymentMethod,
        installments: sale.installments,
        machine_id: sale.machine_id
      }));

      setSales(formattedSales);

      // Calculate stats
      const totalGross = formattedSales.reduce((sum, sale) => sum + Number(sale.gross_amount), 0);
      const totalNet = formattedSales.reduce((sum, sale) => sum + Number(sale.net_amount), 0);
      const totalTransactions = formattedSales.length;
      const avgTicket = totalTransactions > 0 ? totalGross / totalTransactions : 0;

      setStats({
        totalGross,
        totalNet,
        totalTransactions,
        avgTicket
      });

    } catch (err) {
      console.error('Error fetching client sales:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
      setSales([]);
      setStats({ totalGross: 0, totalNet: 0, totalTransactions: 0, avgTicket: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientSales();
  }, [user?.id, startDate, endDate]);

  return {
    sales,
    stats,
    isLoading,
    error,
    refetch: fetchClientSales
  };
};
