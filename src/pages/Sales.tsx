
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSales } from "@/hooks/use-sales";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesTable from "@/components/sales/SalesTable";
import ImportSalesDialog from "@/components/sales/ImportSalesDialog";
import SalesStats from "@/components/sales/SalesStats";
import SalesChart from "@/components/dashboard/SalesChart";
import { useToast } from "@/hooks/use-toast";

const Sales = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  
  const {
    sales,
    isLoading,
    filters,
    date,
    totals,
    paymentMethodSummary,
    handleFilterChange,
    handleDateChange,
    handleQuickFilter,
    clearFilters,
    fetchSales
  } = useSales();
  
  // Calculate pagination
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedSales = sales.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate average ticket
  const averageTicket = totals.count > 0 ? totals.grossAmount / totals.count : 0;

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo será gerado e disponibilizado para download em breve.",
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todas as suas vendas
        </p>
      </div>
      
      <SalesStats 
        totalGross={totals.grossAmount}
        totalNet={totals.netAmount}
        totalCount={totals.count}
        averageTicket={averageTicket}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalesChart 
          data={paymentMethodSummary}
          isLoading={isLoading}
          className="lg:col-span-3"
        />
      </div>
      
      <SalesFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        date={date}
        onDateChange={handleDateChange}
        onClearFilters={clearFilters}
        onExport={handleExport}
        onShowImportDialog={() => setShowImportDialog(true)}
        onQuickFilter={handleQuickFilter}
      />
      
      <SalesTable 
        sales={paginatedSales}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoading={isLoading}
        totals={{
          grossAmount: totals.grossAmount,
          netAmount: totals.netAmount
        }}
      />

      <ImportSalesDialog 
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </MainLayout>
  );
};

export default Sales;
