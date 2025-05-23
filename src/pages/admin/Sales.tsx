
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Filter, Download, RefreshCw, Plus, Eye, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDialog } from "@/hooks/use-dialog";
import { 
  NormalizedSale,
  generateMockSalesData,
  getSalesMetadata
} from "@/utils/sales-processor";
import SalesImportPanel from "@/components/sales/SalesImportPanel";
import SalesPreviewPanel from "@/components/sales/SalesPreviewPanel";
import SalesAdvancedFilter from "@/components/sales/SalesAdvancedFilter";
import { v4 as uuidv4 } from "uuid";

const AdminSales = () => {
  const [sales, setSales] = useState<NormalizedSale[]>([]);
  const [filteredSales, setFilteredSales] = useState<NormalizedSale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showImportPanel, setShowImportPanel] = useState<boolean>(false);
  const { toast } = useToast();
  const importDialog = useDialog();

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    // Generate mock sales data for demonstration
    const mockData = generateMockSalesData(50).map(sale => ({
      ...sale,
      id: uuidv4() // Add unique IDs to the mock data
    }));
    
    setSales(mockData);
    setFilteredSales(mockData);
    setIsLoading(false);
    
    toast({
      title: "Dados carregados",
      description: "Dados de demonstração foram carregados."
    });
  }, []);
  
  // Handle sales import
  const handleSalesImported = (importedSales: NormalizedSale[]) => {
    // Add unique IDs to imported sales
    const salesWithIds = importedSales.map(sale => ({
      ...sale,
      id: sale.id || uuidv4()
    }));
    
    // Combine with existing sales
    const combinedSales = [...sales, ...salesWithIds];
    setSales(combinedSales);
    setFilteredSales(combinedSales);
    setShowImportPanel(false);
    
    toast({
      title: "Importação concluída",
      description: `${importedSales.length} registros importados com sucesso`
    });
  };
  
  // Handle filtering
  const handleFilter = (filtered: NormalizedSale[]) => {
    setFilteredSales(filtered);
  };
  
  // Export to CSV
  const handleExport = () => {
    if (filteredSales.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há dados disponíveis para exportação",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV header
    const header = ['Status', 'Tipo de Pagamento', 'Valor Bruto', 'Data de Transação', 'Parcelas', 'Terminal', 'Bandeira', 'Origem'];
    
    // Convert data to CSV rows
    const rows = filteredSales.map(sale => [
      sale.status,
      sale.payment_type,
      sale.gross_amount.toFixed(2).replace('.', ','),
      typeof sale.transaction_date === 'string' ? sale.transaction_date : sale.transaction_date.toLocaleString('pt-BR'),
      sale.installments,
      sale.terminal,
      sale.brand,
      sale.source
    ]);
    
    // Create CSV content
    const csvContent = [header, ...rows].map(row => row.join(';')).join('\n');
    
    // Add BOM for UTF-8 encoding
    const bom = '\uFEFF';
    
    // Create blob and download
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vendas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: `${filteredSales.length} registros exportados para CSV`
    });
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData = generateMockSalesData(50).map(sale => ({
        ...sale,
        id: uuidv4()
      }));
      
      setSales(mockData);
      setFilteredSales(mockData);
      setIsLoading(false);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados foram atualizados com sucesso"
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas"
        description="Importação e gestão de vendas"
        action={
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={filteredSales.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={() => setShowImportPanel(!showImportPanel)}>
              <FileUp className="mr-2 h-4 w-4" />
              {showImportPanel ? "Ocultar Importação" : "Importar Vendas"}
            </Button>
          </div>
        }
      />
      
      {/* Import Panel - Conditionally Shown */}
      {showImportPanel && (
        <SalesImportPanel onSalesProcessed={handleSalesImported} />
      )}
      
      {/* Filters */}
      <SalesAdvancedFilter sales={sales} onFilter={handleFilter} />
      
      {/* Sales Data */}
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total de Transações</div>
            <div className="text-2xl font-bold mt-1">
              {isLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : filteredSales.length}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Valor Total</div>
            <div className="text-2xl font-bold mt-1">
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(filteredSales.reduce((sum, sale) => sum + sale.gross_amount, 0))
              )}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Valor Médio</div>
            <div className="text-2xl font-bold mt-1">
              {isLoading || filteredSales.length === 0 ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              ) : (
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(
                  filteredSales.reduce((sum, sale) => sum + sale.gross_amount, 0) / filteredSales.length
                )
              )}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Terminais Únicos</div>
            <div className="text-2xl font-bold mt-1">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              ) : (
                new Set(filteredSales.map(sale => sale.terminal)).size
              )}
            </div>
          </Card>
        </div>
        
        {/* Sales Table */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-muted/40 w-full h-12 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <SalesPreviewPanel 
            sales={filteredSales} 
            title="Dados de Vendas"
          />
        )}
      </div>
    </div>
  );
};

export default AdminSales;
