
import { useState, useEffect, useCallback } from "react";
import { Sale, SalesFilterParams } from "@/types";
import { calculateSalesTotals } from "@/utils/sales-utils";
import SalesDataTable from "@/components/sales/SalesDataTable";

interface DateRange {
  from: Date;
  to?: Date;
}

interface AdminSalesContentProps {
  sales: Sale[];
  filters: SalesFilterParams;
  dateRange?: DateRange;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  isLoading: boolean;
}

const AdminSalesContent = ({
  sales,
  filters,
  dateRange,
  page,
  setPage,
  itemsPerPage,
  isLoading
}: AdminSalesContentProps) => {
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  
  // Use useCallback para evitar recriação excessiva da função de filtro
  const applyFilters = useCallback(() => {
    if (isLoading) return;

    let result = [...sales];
    
    // Filter by payment method
    if (filters.paymentMethod) {
      result = result.filter(sale => 
        sale.payment_method === filters.paymentMethod
      );
    }
    
    // Filter by terminal
    if (filters.terminal) {
      result = result.filter(sale => 
        sale.terminal === filters.terminal
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(sale => 
        sale.code.toLowerCase().includes(searchTerm) ||
        sale.terminal.toLowerCase().includes(searchTerm) ||
        sale.client_name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by date range
    if (dateRange?.from) {
      const startDate = new Date(dateRange.from);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
      endDate.setHours(23, 59, 59, 999);
      
      result = result.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
    
    // Filter by specific amount (if specified)
    if (filters.minAmount !== undefined) {
      result = result.filter(sale => 
        Math.abs(sale.gross_amount - filters.minAmount!) < 0.01 // Using a small epsilon for floating-point comparison
      );
    }
    
    // Filter by time range
    if (filters.startHour !== undefined && filters.endHour !== undefined) {
      result = result.filter(sale => {
        const saleHour = new Date(sale.date).getHours();
        return saleHour >= filters.startHour! && saleHour <= filters.endHour!;
      });
    }
    
    setFilteredSales(result);
  }, [sales, filters, dateRange, isLoading]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate totals
  const totals = {
    ...calculateSalesTotals(filteredSales),
    count: filteredSales.length
  };

  return (
    <div className="lg:col-span-3">
      <SalesDataTable 
        sales={paginatedSales}
        currentPage={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setPage}
        totals={totals}
      />
    </div>
  );
};

export default AdminSalesContent;
