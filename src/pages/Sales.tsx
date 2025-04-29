
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Sale, SalesFilterParams } from "@/types";
import { useToast } from "@/hooks/use-toast";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesTable from "@/components/sales/SalesTable";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import { generateMockSales, calculateSalesTotals } from "@/utils/sales-utils";

interface DateRange {
  from: Date;
  to?: Date;
}

const Sales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [date, setDate] = useState<DateRange | undefined>();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  
  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSales = generateMockSales(50);
      setSales(mockSales);
      setFilteredSales(mockSales);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let result = [...sales];
    
    if (filters.paymentMethod) {
      result = result.filter(
        (sale) => sale.paymentMethod === filters.paymentMethod
      );
    }
    
    if (filters.terminal) {
      result = result.filter(
        (sale) => sale.terminal === filters.terminal
      );
    }
    
    if (filters.search) {
      result = result.filter(
        (sale) => sale.code.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (date?.from) {
      const startDate = new Date(date.from);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = date.to ? new Date(date.to) : new Date(date.from);
      endDate.setHours(23, 59, 59, 999);
      
      result = result.filter(
        (sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        }
      );
    }
    
    setFilteredSales(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, date, sales]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate totals
  const totals = calculateSalesTotals(filteredSales);
  
  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
    setDate(undefined);
  };

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo será gerado e disponibilizado para download em breve.",
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todas as suas vendas
        </p>
      </div>
      
      <SalesFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        date={date}
        onDateChange={setDate}
        onClearFilters={clearFilters}
        onExport={handleExport}
        onShowImportDialog={() => setShowImportDialog(true)}
      />
      
      <SalesTable 
        sales={paginatedSales}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoading={isLoading}
        totals={totals}
      />

      <ImportSalesDialog 
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </MainLayout>
  );
};

export default Sales;
