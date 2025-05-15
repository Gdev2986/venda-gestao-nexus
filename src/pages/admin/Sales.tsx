
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateMockSalesData } from "@/utils/sales-utils";
import { SalesFilterParams } from "@/types";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import { useToast } from "@/hooks/use-toast";
import AdminSalesContent from "@/components/admin/sales/AdminSalesContent";
import SalesUploader from "@/components/sales/SalesUploader";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import AdminSalesLayout from "@/components/admin/sales/AdminSalesLayout";
import { useBreakpoint } from "@/hooks/use-mobile";

interface DateRange {
  from: Date;
  to?: Date;
}

const AdminSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50); // 50 items per page
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

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
      setIsLoading(false);
    }, 800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSales();
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "Lista de vendas atualizada com sucesso"
      });
    }, 1500);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exportando registros em ${format.toUpperCase()}`,
      description: "O arquivo será gerado e disponibilizado para download em breve."
    });
  };

  const handleFileProcessed = (file: File, recordCount: number) => {
    toast({
      title: "Upload concluído",
      description: `${recordCount} registros de vendas importados com sucesso.`
    });
    setShowImportDialog(false);
    fetchSales(); // Refresh data after import
  };

  const handleFilterChange = (newFilters: SalesFilterParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange(undefined);
  };

  return (
    <div className="container mx-auto py-4 sm:py-10 px-3 sm:px-4">
      <AdminSalesLayout 
        isRefreshing={isRefreshing} 
        onRefresh={handleRefresh} 
        onImport={() => setShowImportDialog(true)} 
        onExport={() => handleExport('csv')}
      >
        {/* Filters and Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
          {/* Filters Card - 2/3 width */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Filtros</CardTitle>
            </CardHeader>
            <AdminSalesFilters 
              filters={filters} 
              dateRange={dateRange} 
              onFilterChange={handleFilterChange} 
              onDateRangeChange={setDateRange} 
              onClearFilters={handleClearFilters} 
            />
          </Card>
          
          {/* Uploader Card - 1/3 width */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">Upload de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <SalesUploader onFileProcessed={handleFileProcessed} />
            </CardContent>
          </Card>
        </div>

        {/* Sales Data Table - Full Width */}
        <div className="overflow-hidden">
          <AdminSalesContent 
            sales={sales} 
            filters={filters} 
            dateRange={dateRange} 
            page={page} 
            setPage={setPage} 
            itemsPerPage={itemsPerPage} 
            isLoading={isLoading} 
          />
        </div>
        
        <ImportSalesDialog open={showImportDialog} onOpenChange={setShowImportDialog} />
      </AdminSalesLayout>
    </div>
  );
};

export default AdminSales;
