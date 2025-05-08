
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateMockSalesData } from "@/utils/sales-utils";
import { SalesFilterParams } from "@/types";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import { useToast } from "@/hooks/use-toast";
import AdminSalesContent from "@/components/admin/sales/AdminSalesContent";
import SalesUploader from "@/components/sales/SalesUploader";
import SalesAdvancedFilters from "@/components/sales/SalesAdvancedFilters";
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload, Download } from "lucide-react";

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
  
  const handleFilterChange = (newFilters: SalesFilterParams) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters({});
    setDateRange(undefined);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Vendas</h1>
          <p className="text-muted-foreground">
            Visualize, filtre e gerencie todas as vendas realizadas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters and Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Filters Card - 2/3 width */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesAdvancedFilters 
              filters={filters}
              dateRange={dateRange}
              onFilterChange={handleFilterChange}
              onDateRangeChange={setDateRange}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
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
    </div>
  );
};

export default AdminSales;
