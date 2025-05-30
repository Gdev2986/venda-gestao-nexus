
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
    if (!user?.id) {
      console.log('useClientSales: No user ID available');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('useClientSales: Starting fetch for user:', user.id);
    console.log('useClientSales: Date range:', { startDate, endDate });

    try {
      // Get client ID for the user
      console.log('useClientSales: Fetching client access for user:', user.id);
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      console.log('useClientSales: Client access result:', { clientAccess, accessError });

      if (accessError) throw accessError;
      if (!clientAccess) throw new Error('Cliente não encontrado');

      console.log('useClientSales: Found client ID:', clientAccess.client_id);

      // Get machines for this client - agora pegando apenas o serial_number
      console.log('useClientSales: Fetching machines for client:', clientAccess.client_id);
      const { data: clientMachines, error: machinesError } = await supabase
        .from('machines')
        .select('id, serial_number')
        .eq('client_id', clientAccess.client_id);

      console.log('useClientSales: Client machines result:', { clientMachines, machinesError });

      if (machinesError) throw machinesError;

      if (!clientMachines || clientMachines.length === 0) {
        console.log('useClientSales: No machines found for client');
        setSales([]);
        setStats({ totalGross: 0, totalNet: 0, totalTransactions: 0, avgTicket: 0 });
        return;
      }

      // Agora buscar vendas pelo terminal (que deve corresponder ao serial_number)
      const machineSerials = clientMachines.map(m => m.serial_number);
      console.log('useClientSales: Machine serials:', machineSerials);

      // Build sales query buscando diretamente pelo terminal - igual ao admin side
      let salesQuery = supabase
        .from('sales')
        .select('id, code, terminal, date, gross_amount, net_amount, payment_method, installments, machine_id')
        .in('terminal', machineSerials)
        .order('date', { ascending: false });

      // Apply date filters only if they exist - exatamente como no admin
      if (startDate) {
        const startISO = startDate.toISOString();
        console.log('useClientSales: Adding start date filter:', startISO);
        salesQuery = salesQuery.gte('date', startISO);
      }
      
      if (endDate) {
        const endISO = endDate.toISOString();
        console.log('useClientSales: Adding end date filter:', endISO);
        salesQuery = salesQuery.lte('date', endISO);
      }

      console.log('useClientSales: Executing sales query with terminals:', machineSerials);
      const { data: salesData, error: salesError } = await salesQuery;

      console.log('useClientSales: Sales query result:', { 
        salesData, 
        salesError,
        count: salesData?.length || 0 
      });

      if (salesError) throw salesError;

      const formattedSales: ClientSale[] = (salesData || []).map((sale: any) => ({
        id: sale.id,
        code: sale.code,
        terminal: sale.terminal,
        date: sale.date,
        gross_amount: sale.gross_amount,
        net_amount: sale.net_amount,
        payment_method: sale.payment_method as PaymentMethod,
        installments: sale.installments,
        machine_id: sale.machine_id
      }));

      console.log('useClientSales: Formatted sales:', formattedSales);

      setSales(formattedSales);

      // Calculate stats
      const totalGross = formattedSales.reduce((sum, sale) => sum + Number(sale.gross_amount), 0);
      const totalNet = formattedSales.reduce((sum, sale) => sum + Number(sale.net_amount), 0);
      const totalTransactions = formattedSales.length;
      const avgTicket = totalTransactions > 0 ? totalGross / totalTransactions : 0;

      const calculatedStats = {
        totalGross,
        totalNet,
        totalTransactions,
        avgTicket
      };

      console.log('useClientSales: Calculated stats:', calculatedStats);

      setStats(calculatedStats);

    } catch (err) {
      console.error('useClientSales: Error fetching client sales:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
      setSales([]);
      setStats({ totalGross: 0, totalNet: 0, totalTransactions: 0, avgTicket: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useClientSales: Effect triggered, user.id:', user?.id);
    console.log('useClientSales: Effect triggered, dates:', { startDate, endDate });
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
