
import { supabase } from "@/integrations/supabase/client";

export interface ClientSalesResult {
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
  total_count: number;
}

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
    }
  };
}

export const clientSalesOptimizedService = {
  // Buscar terminais do cliente com debug detalhado
  async getClientTerminals(clientId: string): Promise<string[]> {
    try {
      console.log('[DEBUG] getClientTerminals - Starting for client:', clientId);
      console.log('[DEBUG] getClientTerminals - Supabase client status:', !!supabase);
      
      const { data: machines, error } = await supabase
        .from('machines')
        .select('id')
        .eq('client_id', clientId);

      console.log('[DEBUG] getClientTerminals - Machines query result:', { 
        machines, 
        error,
        machineCount: machines?.length || 0
      });

      if (error) {
        console.error('[DEBUG] getClientTerminals - Error fetching machines:', error);
        return [];
      }

      if (!machines || machines.length === 0) {
        console.log('[DEBUG] getClientTerminals - No machines found for client, trying fallback approach');
        
        // Fallback: buscar diretamente por vendas do cliente usando user_client_access
        const { data: userAccess } = await supabase
          .from('user_client_access')
          .select('user_id')
          .eq('client_id', clientId);
        
        console.log('[DEBUG] getClientTerminals - User access found:', userAccess);
        
        // Se não conseguiu nem isso, retornar array vazio
        return [];
      }

      // Buscar terminais únicos das vendas dessas máquinas
      const machineIds = machines.map(m => m.id);
      console.log('[DEBUG] getClientTerminals - Machine IDs:', machineIds);
      
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('terminal')
        .in('machine_id', machineIds);

      console.log('[DEBUG] getClientTerminals - Sales query result:', { 
        sales, 
        salesError,
        salesCount: sales?.length || 0
      });

      if (salesError) {
        console.error('[DEBUG] getClientTerminals - Error fetching terminals from sales:', salesError);
        return [];
      }

      // Retornar terminais únicos
      const uniqueTerminals = [...new Set(sales?.map(s => s.terminal) || [])];
      console.log('[DEBUG] getClientTerminals - Unique terminals found:', uniqueTerminals);
      
      return uniqueTerminals;
    } catch (error) {
      console.error('[DEBUG] getClientTerminals - Unexpected error:', error);
      return [];
    }
  },

  // Buscar configuração de taxas do cliente
  async getClientTaxConfig(clientId: string) {
    try {
      console.log('Getting tax config for client:', clientId);
      
      // Buscar bloco de taxa do cliente
      const { data: clientTaxBlock, error: blockError } = await supabase
        .from('client_tax_blocks')
        .select(`
          block_id,
          tax_blocks (
            id,
            name
          )
        `)
        .eq('client_id', clientId)
        .single();

      if (blockError) {
        console.log('No tax block found for client, using default rates');
        return null;
      }

      // Buscar taxas do bloco
      const { data: taxRates, error: ratesError } = await supabase
        .from('tax_rates')
        .select('*')
        .eq('block_id', clientTaxBlock.block_id);

      if (ratesError) {
        console.error('Error fetching tax rates:', ratesError);
        return null;
      }

      console.log('Found tax config:', { block: clientTaxBlock, rates: taxRates });
      return { block: clientTaxBlock, rates: taxRates || [] };
    } catch (error) {
      console.error('Error in getClientTaxConfig:', error);
      return null;
    }
  },

  // Calcular valor líquido e taxa baseado na configuração do cliente
  calculateNetAmount(grossAmount: number, paymentMethod: string, installments: number, taxConfig: any) {
    if (!taxConfig || !taxConfig.rates) {
      // Taxas padrão se não houver configuração específica
      const defaultRates = {
        'PIX': 2.99,
        'DEBIT': 2.99,
        'CREDIT': installments === 1 ? 3.99 : 4.99
      };
      
      const rate = defaultRates[paymentMethod as keyof typeof defaultRates] || 3.99;
      const taxAmount = (grossAmount * rate) / 100;
      const netAmount = grossAmount - taxAmount;
      
      return { netAmount, taxAmount, taxRate: rate };
    }

    // Buscar taxa específica
    const taxRate = taxConfig.rates.find((rate: any) => 
      rate.payment_method === paymentMethod && rate.installment === installments
    );

    if (taxRate) {
      const rate = taxRate.final_rate;
      const taxAmount = (grossAmount * rate) / 100;
      const netAmount = grossAmount - taxAmount;
      
      return { netAmount, taxAmount, taxRate: rate };
    }

    // Fallback para taxa padrão
    const defaultRate = 3.99;
    const taxAmount = (grossAmount * defaultRate) / 100;
    const netAmount = grossAmount - taxAmount;
    
    return { netAmount, taxAmount, taxRate: defaultRate };
  },

  // Buscar vendas do cliente usando get_sales_optimized com debug
  async getClientSalesWithTaxes(
    clientId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    pageSize: number = 1000
  ) {
    try {
      console.log('[DEBUG] getClientSalesWithTaxes - Starting for client:', clientId);
      
      // 1. Buscar terminais do cliente
      const terminals = await this.getClientTerminals(clientId);
      console.log('[DEBUG] getClientSalesWithTaxes - Terminals received:', terminals);
      
      if (terminals.length === 0) {
        console.log('[DEBUG] getClientSalesWithTaxes - No terminals found, implementing fallback strategy');
        
        // Estratégia de fallback: buscar vendas usando machine_id diretamente
        const { data: machines } = await supabase
          .from('machines')
          .select('id')
          .eq('client_id', clientId);
        
        console.log('[DEBUG] getClientSalesWithTaxes - Fallback machines found:', machines?.length || 0);
        
        if (!machines || machines.length === 0) {
          console.log('[DEBUG] getClientSalesWithTaxes - No machines in fallback, returning empty result');
          return {
            sales: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page
          };
        }
        
        // Usar machine_ids diretamente nas vendas se não conseguir terminais
        const machineIds = machines.map(m => m.id);
        const { data: salesData } = await supabase
          .from('sales')
          .select('*')
          .in('machine_id', machineIds)
          .range((page - 1) * pageSize, page * pageSize - 1)
          .order('date', { ascending: false });
        
        console.log('[DEBUG] getClientSalesWithTaxes - Fallback sales found:', salesData?.length || 0);
        
        if (!salesData || salesData.length === 0) {
          return {
            sales: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page
          };
        }
        
        // Processar vendas do fallback
        const taxConfig = await this.getClientTaxConfig(clientId);
        const sales = salesData.map((sale: any) => {
          const { netAmount, taxAmount, taxRate } = this.calculateNetAmount(
            Number(sale.gross_amount),
            sale.payment_method,
            sale.installments || 1,
            taxConfig
          );

          return {
            id: sale.id,
            code: sale.code,
            terminal: sale.terminal,
            transaction_date: sale.date,
            gross_amount: Number(sale.gross_amount),
            net_amount: netAmount,
            tax_amount: taxAmount,
            tax_rate: taxRate,
            payment_type: sale.payment_method,
            installments: sale.installments || 1,
            total_count: salesData.length
          };
        });
        
        return {
          sales,
          totalCount: salesData.length,
          totalPages: Math.ceil(salesData.length / pageSize),
          currentPage: page
        };
      }

      // 2. Buscar configuração de taxas
      const taxConfig = await this.getClientTaxConfig(clientId);

      // 3. Usar get_sales_optimized filtrada por terminais
      const { data, error } = await supabase.rpc('get_sales_optimized', {
        page_number: page,
        page_size: pageSize,
        filter_date_start: startDate || null,
        filter_date_end: endDate || null,
        filter_hour_start: null,
        filter_hour_end: null,
        filter_terminals: terminals,
        filter_payment_type: null,
        filter_source: null
      });

      console.log('[DEBUG] getClientSalesWithTaxes - RPC result:', { 
        data: data?.length || 0, 
        error 
      });

      if (error) {
        console.error('Error fetching client sales:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      const totalCount = data[0]?.total_count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      // 4. Processar vendas com cálculo de taxas
      const sales = data.map((sale: any) => {
        const { netAmount, taxAmount, taxRate } = this.calculateNetAmount(
          Number(sale.gross_amount),
          sale.payment_method,
          sale.installments || 1,
          taxConfig
        );

        return {
          id: sale.id,
          code: sale.code,
          terminal: sale.terminal,
          transaction_date: sale.date,
          gross_amount: Number(sale.gross_amount),
          net_amount: netAmount,
          tax_amount: taxAmount,
          tax_rate: taxRate,
          payment_type: sale.payment_method,
          installments: sale.installments || 1,
          total_count: totalCount
        };
      });

      console.log('[DEBUG] getClientSalesWithTaxes - Final result:', {
        salesCount: sales.length,
        totalCount,
        totalPages
      });

      return {
        sales,
        totalCount,
        totalPages,
        currentPage: page
      };

    } catch (error) {
      console.error('[DEBUG] getClientSalesWithTaxes - Error:', error);
      throw error;
    }
  },

  // Calcular estatísticas do cliente
  async getClientSalesStats(
    clientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ClientSalesStats> {
    try {
      console.log('clientSalesOptimizedService: Getting stats for client:', clientId);
      
      // Buscar terminais do cliente
      const terminals = await this.getClientTerminals(clientId);
      
      if (terminals.length === 0) {
        return {
          total_transactions: 0,
          total_gross: 0,
          total_net: 0,
          total_taxes: 0,
          payment_method_stats: {}
        };
      }

      // Buscar configuração de taxas
      const taxConfig = await this.getClientTaxConfig(clientId);

      // Usar get_sales_aggregated_stats para totais básicos
      const { data: statsData, error: statsError } = await supabase.rpc('get_sales_aggregated_stats', {
        filter_date_start: startDate || null,
        filter_date_end: endDate || null,
        filter_hour_start: null,
        filter_hour_end: null,
        filter_terminals: terminals,
        filter_payment_type: null,
        filter_source: null
      });

      if (statsError) {
        console.error('Error fetching client stats:', statsError);
        return {
          total_transactions: 0,
          total_gross: 0,
          total_net: 0,
          total_taxes: 0,
          payment_method_stats: {}
        };
      }

      const stats = statsData?.[0] || {
        total_sales: 0,
        total_gross_amount: 0,
        total_net_amount: 0,
        office_commission: 0
      };

      // Buscar vendas para breakdown por método de pagamento
      const { data: salesData, error: salesError } = await supabase.rpc('get_sales_optimized', {
        page_number: 1,
        page_size: 10000, // Pegar todas para calcular stats
        filter_date_start: startDate || null,
        filter_date_end: endDate || null,
        filter_hour_start: null,
        filter_hour_end: null,
        filter_terminals: terminals,
        filter_payment_type: null,
        filter_source: null
      });

      let paymentMethodStats: { [key: string]: { gross: number; net: number; taxes: number; count: number } } = {};

      if (!salesError && salesData) {
        // Calcular stats por método de pagamento
        salesData.forEach((sale: any) => {
          const method = sale.payment_method;
          const { netAmount, taxAmount } = this.calculateNetAmount(
            Number(sale.gross_amount),
            method,
            sale.installments || 1,
            taxConfig
          );

          if (!paymentMethodStats[method]) {
            paymentMethodStats[method] = {
              gross: 0,
              net: 0,
              taxes: 0,
              count: 0
            };
          }

          paymentMethodStats[method].gross += Number(sale.gross_amount);
          paymentMethodStats[method].net += netAmount;
          paymentMethodStats[method].taxes += taxAmount;
          paymentMethodStats[method].count += 1;
        });
      }

      // Recalcular totais baseado nas taxas corretas
      const totals = Object.values(paymentMethodStats).reduce((acc, method) => ({
        net: acc.net + method.net,
        taxes: acc.taxes + method.taxes
      }), { net: 0, taxes: 0 });

      const result = {
        total_transactions: Number(stats.total_sales || 0),
        total_gross: Number(stats.total_gross_amount || 0),
        total_net: totals.net,
        total_taxes: totals.taxes,
        payment_method_stats: paymentMethodStats
      };

      console.log('clientSalesOptimizedService: Got stats:', result);

      return result;

    } catch (error) {
      console.error('clientSalesOptimizedService: Error getting stats:', error);
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
