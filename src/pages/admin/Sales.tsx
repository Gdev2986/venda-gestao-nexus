
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import SalesImportPanel from "@/components/sales/SalesImportPanel";
import SalesPreviewPanel from "@/components/sales/SalesPreviewPanel";
import SalesAdvancedFilter from "@/components/sales/SalesAdvancedFilter";
import { SalesStatCards } from "@/components/admin/sales/SalesStatCards";
import { SalesActionButtons } from "@/components/admin/sales/SalesActionButtons";
import { useOptimizedSales } from "@/hooks/use-optimized-sales";
import { NormalizedSale } from "@/utils/sales-processor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const AdminSales = () => {
  const [showImportPanel, setShowImportPanel] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const {
    sales,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    updateFilters,
    changePage,
    refreshSales,
    salesSummary
  } = useOptimizedSales();

  const handleSalesImported = (importedSales: NormalizedSale[]) => {
    refreshSales();
  };

  const handleFilter = (filtered: NormalizedSale[]) => {
    // Compatibilidade com SalesAdvancedFilter
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas"
        description="Importação e gestão de vendas"
        action={
          <SalesActionButtons
            filteredSales={sales}
            isLoading={isLoading}
            showImportPanel={showImportPanel}
            setShowImportPanel={setShowImportPanel}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onRefresh={refreshSales}
          />
        }
      />
      
      {/* Mostrar resumo geral quando disponível */}
      {salesSummary && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Resumo Geral:</strong> {salesSummary.total_records.toLocaleString('pt-BR')} transações totais 
            • Valor Total: R$ {Number(salesSummary.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            • Período: {new Date(salesSummary.earliest_date).toLocaleDateString('pt-BR')} a {new Date(salesSummary.latest_date).toLocaleDateString('pt-BR')}
          </AlertDescription>
        </Alert>
      )}
      
      {showImportPanel && (
        <SalesImportPanel onSalesProcessed={handleSalesImported} />
      )}
      
      <SalesStatCards filteredSales={sales} isLoading={isLoading} />
      
      {showFilters && (
        <SalesAdvancedFilter sales={sales} onFilter={handleFilter} />
      )}
      
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-muted/40 w-full h-12 animate-pulse rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <SalesPreviewPanel 
            sales={sales} 
            title="Dados de Vendas"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
            totalCount={totalCount}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSales;
