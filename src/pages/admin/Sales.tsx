
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMockSalesData, calculateSalesTotals } from "@/utils/sales-utils";
import SalesAdvancedFilters from "@/components/sales/SalesAdvancedFilters";
import SalesDataTable from "@/components/sales/SalesDataTable";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Sale, SalesFilterParams } from "@/types";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import { useToast } from "@/hooks/use-toast";

interface DateRange {
  from: Date;
  to?: Date;
}

const AdminSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  
  // Load initial data
  useEffect(() => {
    fetchSales();
  }, []);
  
  const fetchSales = () => {
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      const mockSales = generateMockSalesData(150);
      setSales(mockSales);
      setFilteredSales(mockSales);
      setIsLoading(false);
    }, 800);
  };
  
  // Apply filters when they change
  useEffect(() => {
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
    
    // Apply additional advanced filters
    if (filters.minAmount) {
      result = result.filter(sale => sale.gross_amount >= filters.minAmount);
    }
    
    if (filters.maxAmount) {
      result = result.filter(sale => sale.gross_amount <= filters.maxAmount);
    }
    
    if (filters.startHour !== undefined && filters.endHour !== undefined) {
      result = result.filter(sale => {
        const saleHour = new Date(sale.date).getHours();
        return saleHour >= filters.startHour! && saleHour <= filters.endHour!;
      });
    }
    
    setFilteredSales(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, dateRange, sales]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate totals
  const totals = calculateSalesTotals(filteredSales);
  
  const handleFilterChange = (newFilters: SalesFilterParams) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando ${filteredSales.length} registros em ${format.toUpperCase()}`,
      description: "O arquivo será gerado e disponibilizado para download em breve."
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize, filtre e gerencie todas as vendas realizadas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4" />
            Importar Vendas
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros Avançados</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesAdvancedFilters
            filters={filters}
            dateRange={dateRange}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={() => {
              setFilters({});
              setDateRange(undefined);
            }}
          />
        </CardContent>
      </Card>
      
      <SalesDataTable 
        sales={paginatedSales}
        currentPage={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setPage}
        totals={totals}
      />
      
      <ImportSalesDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
};

export default AdminSales;
