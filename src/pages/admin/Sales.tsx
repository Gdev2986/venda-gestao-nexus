
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import SalesUploader from "@/components/sales/SalesUploader";
import SalesAdvancedFilters from "@/components/sales/SalesAdvancedFilters";
import SalesDataTable from "@/components/sales/SalesDataTable";
import { PATHS } from "@/routes/paths";
import { Skeleton } from "@/components/ui/skeleton";
import { Sale, PaymentMethod } from "@/types";
import { generateMockSales, DateRange } from "@/utils/sales-utils";
import { useToast } from "@/hooks/use-toast";

const AdminSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(new Date().setDate(new Date().getDate() - 1)),
  });
  const { toast } = useToast();
  const itemsPerPage = 50;

  // Generate mock sales data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockSales = generateMockSales(150, dateRange);
      setSales(mockSales);
      setFilteredSales(mockSales);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [dateRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals for the current view
  const totals = currentSales.reduce(
    (acc, sale) => ({
      grossAmount: acc.grossAmount + sale.gross_amount,
      netAmount: acc.netAmount + sale.net_amount
    }),
    { grossAmount: 0, netAmount: 0 }
  );

  // Handle file upload processing
  const handleFileProcessed = (file: File, recordCount: number) => {
    toast({
      title: "Upload simulado com sucesso",
      description: `Arquivo ${file.name} com ${recordCount} registros processado (simulação).`,
    });
    
    // TODO: Implement backend integration for file uploads
    // Refresh data after upload
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setIsLoading(true);
    
    // Simulate filtering delay
    setTimeout(() => {
      let filtered = [...sales];
      
      // Apply date range filter
      if (filters.dateRange) {
        const fromTime = filters.dateRange.from.getTime();
        const toTime = filters.dateRange.to.getTime();
        filtered = filtered.filter(
          (sale) => {
            const saleTime = new Date(sale.date).getTime();
            return saleTime >= fromTime && saleTime <= toTime;
          }
        );
      }
      
      // Apply terminal filter
      if (filters.terminal) {
        filtered = filtered.filter(sale => sale.terminal === filters.terminal);
      }
      
      // Apply payment method filter
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        filtered = filtered.filter(sale => 
          filters.paymentMethods.includes(sale.paymentMethod)
        );
      }
      
      // Apply installments filter
      if (filters.installments) {
        // TODO: Add installments field to Sale type and implement filtering
      }
      
      // Apply amount range filter
      if (filters.amountRange) {
        const { min, max } = filters.amountRange;
        if (min !== undefined) {
          filtered = filtered.filter(sale => sale.gross_amount >= min);
        }
        if (max !== undefined) {
          filtered = filtered.filter(sale => sale.gross_amount <= max);
        }
      }
      
      setFilteredSales(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas" 
        description="Gerencie e visualize todas as vendas do sistema"
        actionLabel="Nova Venda"
        actionLink={PATHS.ADMIN.SALES_NEW}
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <SalesUploader onFileProcessed={handleFileProcessed} />
        </div>
        <div className="md:col-span-2">
          <SalesAdvancedFilters 
            onFilterChange={handleFilterChange} 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>
      
      {isLoading ? (
        <PageWrapper>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </PageWrapper>
      ) : (
        <SalesDataTable 
          sales={currentSales}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          totals={totals}
        />
      )}
    </div>
  );
};

export default AdminSales;
