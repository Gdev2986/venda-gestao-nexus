
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import SalesImportPanel from "@/components/sales/SalesImportPanel";
import SalesPreviewPanel from "@/components/sales/SalesPreviewPanel";
import SalesAdvancedFilter from "@/components/sales/SalesAdvancedFilter";
import { SalesStatCards } from "@/components/admin/sales/SalesStatCards";
import { SalesActionButtons } from "@/components/admin/sales/SalesActionButtons";
import { useSalesContext } from "@/contexts/SalesContext";

const AdminSales = () => {
  const [showImportPanel, setShowImportPanel] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const {
    sales,
    filteredSales,
    isLoading,
    refreshSales,
    handleSalesImported,
    handleFilter
  } = useSalesContext();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas"
        description="Importação e gestão de vendas"
        action={
          <SalesActionButtons
            filteredSales={filteredSales}
            isLoading={isLoading}
            showImportPanel={showImportPanel}
            setShowImportPanel={setShowImportPanel}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onRefresh={refreshSales}
          />
        }
      />
      
      {showImportPanel && (
        <SalesImportPanel onSalesProcessed={handleSalesImported} />
      )}
      
      <SalesStatCards filteredSales={filteredSales} isLoading={isLoading} />
      
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
            sales={filteredSales} 
            title="Dados de Vendas"
          />
        )}
      </div>
    </div>
  );
};

export default AdminSales;
