
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

interface DateRange {
  from: Date;
  to?: Date;
}

const AdminSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50); // Changed to 50 items per page
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    <div className="container mx-auto py-10">
      <AdminSalesLayout
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onImport={() => setShowImportDialog(true)}
        onExport={() => handleExport('csv')}
      >
        {/* Filters and Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Filters Card - 2/3 width */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
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
            <CardHeader>
              <CardTitle>Upload de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesUploader onFileProcessed={handleFileProcessed} />
            </CardContent>
          </Card>
        </div>

        {/* Sales Data Table - Full Width */}
        <AdminSalesContent 
          sales={sales}
          filters={filters}
          dateRange={dateRange}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
        
        <ImportSalesDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
        />
      </AdminSalesLayout>
    </div>
  );
};

export default AdminSales;
