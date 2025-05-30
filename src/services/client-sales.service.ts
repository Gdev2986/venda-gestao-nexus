
import { optimizedSalesService, SalesFilters, PaginatedSalesResult } from "@/services/optimized-sales.service";
import { supabase } from "@/integrations/supabase/client";

export interface ClientSalesFilters extends Omit<SalesFilters, 'terminals'> {
  // Remove terminals from filters since we'll auto-apply client machines
}

export const clientSalesService = {
  // Get client machines and fetch sales using optimized service
  async getClientSalesPaginated(
    clientId: string,
    page: number = 1,
    pageSize: number = 1000,
    filters: ClientSalesFilters = {}
  ): Promise<PaginatedSalesResult> {
    try {
      console.log('clientSalesService: Getting machines for client:', clientId);
      
      // Get client machines serial numbers
      const { data: clientMachines, error: machinesError } = await supabase
        .from('machines')
        .select('serial_number')
        .eq('client_id', clientId);

      if (machinesError) {
        console.error('clientSalesService: Error fetching machines:', machinesError);
        throw machinesError;
      }

      if (!clientMachines || clientMachines.length === 0) {
        console.log('clientSalesService: No machines found for client');
        return {
          sales: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page
        };
      }

      // Extract serial numbers to use as terminal filter
      const machineSerials = clientMachines.map(m => m.serial_number);
      console.log('clientSalesService: Machine serials for client:', machineSerials);

      // Use optimized sales service with terminal filter
      const salesFilters: SalesFilters = {
        ...filters,
        terminals: machineSerials // Auto-apply client machines filter
      };

      console.log('clientSalesService: Calling optimized service with filters:', salesFilters);
      
      // Delegate to optimized sales service
      const result = await optimizedSalesService.getSalesPaginated(page, pageSize, salesFilters);
      
      console.log('clientSalesService: Got result from optimized service:', {
        salesCount: result.sales.length,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage
      });

      return result;

    } catch (error) {
      console.error('clientSalesService: Error in getClientSalesPaginated:', error);
      return {
        sales: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      };
    }
  },

  // Delegate other methods to optimized service
  async getDateRange() {
    return optimizedSalesService.getDateRange();
  },

  async getDatesWithSales() {
    return optimizedSalesService.getDatesWithSales();
  },

  getYesterday() {
    return optimizedSalesService.getYesterday();
  },

  formatDateForDisplay(dateStr: string) {
    return optimizedSalesService.formatDateForDisplay(dateStr);
  }
};
