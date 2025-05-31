
import { supabase } from "@/integrations/supabase/client";

export interface ClientSalesStats {
  total_transactions: number;
  total_gross: number;
  total_net: number;
  total_taxes: number;
  payment_method_stats: {
    [key: string]: {
      gross: number;
      net: number;
      taxes: number;
      count: number;
    };
  };
}

export interface ClientSale {
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

export interface PaginatedClientSalesResult {
  sales: ClientSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const clientSalesOptimizedService = {
  async getClientSalesWithTaxes(
    clientId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    pageSize: number = 1000
  ): Promise<PaginatedClientSalesResult> {
    try {
      console.log('Getting client sales for:', { clientId, startDate, endDate, page, pageSize });

      // First, get client machines serial numbers
      const { data: clientMachines, error: machinesError } = await supabase
        .from('machines')
        .select('serial_number')
        .eq('client_id', clientId);

      if (machinesError) {
        console.error('Error fetching client machines:', machinesError);
        throw machinesError;
      }

      if (!clientMachines || clientMachines.length === 0) {
        console.log('No machines found for client:', clientId);
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      // Extract serial numbers for terminal filter
      const machineSerials = clientMachines.map(m => m.serial_number);
      console.log('Client machine terminals:', machineSerials);

      // Build query for sales
      let query = supabase
        .from('sales')
        .select('*', { count: 'exact' })
        .in('terminal', machineSerials);

      // Apply date filters
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate + 'T23:59:59.999Z');
      }

      // Apply pagination
      const offset = (page - 1) * pageSize;
      query = query
        .order('date', { ascending: false })
        .range(offset, offset + pageSize - 1);

      const { data: salesData, error: salesError, count } = await query;

      if (salesError) {
        console.error('Error fetching sales:', salesError);
        throw salesError;
      }

      console.log('Found sales:', salesData?.length, 'Total count:', count);

      // Transform sales data
      const transformedSales: ClientSale[] = (salesData || []).map(sale => {
        const grossAmount = Number(sale.gross_amount);
        const netAmount = Number(sale.net_amount);
        const taxAmount = grossAmount - netAmount;
        const taxRate = grossAmount > 0 ? (taxAmount / grossAmount) * 100 : 0;

        return {
          id: sale.id,
          code: sale.code,
          terminal: sale.terminal,
          transaction_date: new Date(sale.date).toLocaleString('pt-BR'),
          gross_amount: grossAmount,
          net_amount: netAmount,
          tax_amount: taxAmount,
          tax_rate: taxRate,
          payment_type: sale.payment_method,
          installments: sale.installments || 1
        };
      });

      const totalPages = Math.ceil((count || 0) / pageSize);

      return {
        sales: transformedSales,
        totalCount: count || 0,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('Error in getClientSalesWithTaxes:', error);
      return {
        sales: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  },

  async getClientSalesStats(
    clientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ClientSalesStats> {
    try {
      console.log('Getting client sales stats for:', { clientId, startDate, endDate });

      // First, get client machines serial numbers
      const { data: clientMachines, error: machinesError } = await supabase
        .from('machines')
        .select('serial_number')
        .eq('client_id', clientId);

      if (machinesError) {
        console.error('Error fetching client machines for stats:', machinesError);
        throw machinesError;
      }

      if (!clientMachines || clientMachines.length === 0) {
        console.log('No machines found for client stats:', clientId);
        return {
          total_transactions: 0,
          total_gross: 0,
          total_net: 0,
          total_taxes: 0,
          payment_method_stats: {}
        };
      }

      // Extract serial numbers for terminal filter
      const machineSerials = clientMachines.map(m => m.serial_number);

      // Build query for sales statistics
      let query = supabase
        .from('sales')
        .select('gross_amount, net_amount, payment_method')
        .in('terminal', machineSerials);

      // Apply date filters
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate + 'T23:59:59.999Z');
      }

      const { data: salesData, error: salesError } = await query;

      if (salesError) {
        console.error('Error fetching sales for stats:', salesError);
        throw salesError;
      }

      console.log('Found sales for stats:', salesData?.length);

      // Calculate statistics
      const stats: ClientSalesStats = {
        total_transactions: salesData?.length || 0,
        total_gross: 0,
        total_net: 0,
        total_taxes: 0,
        payment_method_stats: {}
      };

      (salesData || []).forEach(sale => {
        const grossAmount = Number(sale.gross_amount);
        const netAmount = Number(sale.net_amount);
        const taxAmount = grossAmount - netAmount;
        const paymentMethod = sale.payment_method;

        stats.total_gross += grossAmount;
        stats.total_net += netAmount;
        stats.total_taxes += taxAmount;

        // Payment method statistics
        if (!stats.payment_method_stats[paymentMethod]) {
          stats.payment_method_stats[paymentMethod] = {
            gross: 0,
            net: 0,
            taxes: 0,
            count: 0
          };
        }

        stats.payment_method_stats[paymentMethod].gross += grossAmount;
        stats.payment_method_stats[paymentMethod].net += netAmount;
        stats.payment_method_stats[paymentMethod].taxes += taxAmount;
        stats.payment_method_stats[paymentMethod].count += 1;
      });

      console.log('Calculated stats:', stats);
      return stats;

    } catch (error) {
      console.error('Error in getClientSalesStats:', error);
      return {
        total_transactions: 0,
        total_gross: 0,
        total_net: 0,
        total_taxes: 0,
        payment_method_stats: {}
      };
    }
  }
};
