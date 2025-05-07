
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMockSalesData } from "@/utils/sales-utils";
import { Button } from "@/components/ui/button";
import { Upload, Download, RefreshCw } from "lucide-react";
import { SalesFilterParams } from "@/types";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import { useToast } from "@/hooks/use-toast";
import SalesUploader from "@/components/sales/SalesUploader";
import AdminSalesLayout from "@/components/admin/sales/AdminSalesLayout";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import AdminSalesContent from "@/components/admin/sales/AdminSalesContent";

interface DateRange {
  from: Date;
  to?: Date;
}

const AdminSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50);
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
      setFilteredSales(mockSales);
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
      title: `Exportando ${filteredSales.length} registros em ${format.toUpperCase()}`,
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

  return (
    <AdminSalesLayout 
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      onImport={() => setShowImportDialog(true)}
      onExport={() => handleExport('csv')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Filters and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <AdminSalesFilters
              filters={filters}
              dateRange={dateRange}
              onFilterChange={setFilters}
              onDateRangeChange={setDateRange}
              onClearFilters={() => {
                setFilters({});
                setDateRange(undefined);
              }}
            />
          </Card>
          
          {!showImportDialog && (
            <SalesUploader onFileProcessed={handleFileProcessed} />
          )}
        </div>
        
        {/* Right column - Sales Table */}
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
      
      <ImportSalesDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </AdminSalesLayout>
  );
};

export default AdminSales;
