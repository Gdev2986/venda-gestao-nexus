
import { PageHeader } from "@/components/page/PageHeader";
import { SalesActionButtons } from "@/components/admin/sales/SalesActionButtons";
import { SalesStatCards } from "@/components/admin/sales/SalesStatCards";
import SalesImportPanel from "@/components/sales/SalesImportPanel";
import OptimizedSalesFilter from "@/components/sales/OptimizedSalesFilter";
import OptimizedSalesTable from "@/components/sales/OptimizedSalesTable";
import PeriodAndTimeFilter from "@/components/sales/PeriodAndTimeFilter";
import { useOptimizedSales } from "@/hooks/use-optimized-sales";
import { useState } from "react";

const OptimizedSalesPage = () => {
  const [showImportPanel, setShowImportPanel] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  
  const {
    sales,
    totalCount,
    totalPages,
    currentPage,
    dateRange,
    availableDates,
    filters,
    isLoading,
    updateFilters,
    changePage,
    resetFilters,
    refreshSales,
    periodStats
  } = useOptimizedSales();

  const handleSalesImported = () => {
    refreshSales();
    setShowImportPanel(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas Otimizadas" 
        description="Sistema otimizado para milhões de registros com paginação real e filtros avançados"
        action={
          <SalesActionButtons
            filteredSales={sales}
            isLoading={isLoading}
            showImportPanel={showImportPanel}
            setShowImportPanel={setShowImportPanel}
            onRefresh={refreshSales}
          />
        }
      />
      
      {/* Filtro de período e horário GLOBAL no topo da página */}
      <div className="bg-muted/30 p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Filtros Globais</h3>
          <span className="text-sm text-muted-foreground">
            - Aplicados a toda a base de dados
          </span>
        </div>
        <PeriodAndTimeFilter
          filters={filters}
          availableDates={availableDates}
          onFiltersChange={updateFilters}
        />
      </div>
      
      {showImportPanel && (
        <SalesImportPanel onSalesProcessed={handleSalesImported} />
      )}
      
      <SalesStatCards periodStats={periodStats} isLoading={isLoading} />
      
      {showFilters && (
        <OptimizedSalesFilter
          filters={filters}
          availableDates={availableDates}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
        />
      )}
      
      <div className="space-y-4">
        <OptimizedSalesTable
          sales={sales}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          isLoading={isLoading}
          onPageChange={changePage}
        />
      </div>

      {/* Informações de Performance */}
      {dateRange && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Período disponível:</span><br />
              {dateRange.earliest_date} a {dateRange.latest_date}
            </div>
            <div>
              <span className="font-medium">Total de registros:</span><br />
              {dateRange.total_records.toLocaleString('pt-BR')}
            </div>
            <div>
              <span className="font-medium">Filtros ativos:</span><br />
              {Object.keys(filters).filter(key => filters[key as keyof typeof filters] !== undefined).length} filtros
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedSalesPage;
