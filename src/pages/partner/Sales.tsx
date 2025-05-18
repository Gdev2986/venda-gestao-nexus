import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { FileUp, Plus } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { Card, CardContent } from "@/components/ui/card";
import AdminSalesLayout from "@/components/admin/sales/AdminSalesLayout";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import AdminSalesContent, { SalesData } from "@/components/admin/sales/AdminSalesContent";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

// Sample data for demonstration
const mockSalesData: SalesData[] = [
  { id: '1', date: '2025-01-01', amount: 150, client: 'Company A', status: 'completed' },
  { id: '2', date: '2025-01-02', amount: 200, client: 'Company B', status: 'pending' },
  { id: '3', date: '2025-01-03', amount: 300, client: 'Company C', status: 'completed' },
];

const PartnerSalesPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: {
      from: addDays(new Date(), -30),
      to: new Date(),
    }
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState<SalesData[]>(mockSalesData);
  
  const importDialog = useDialog();
  const createSaleDialog = useDialog();
  const { toast } = useToast();

  const refreshSales = async () => {
    setIsRefreshing(true);
    // In a real app, this would fetch sales data
    setTimeout(() => {
      setSales(mockSalesData);
      setIsRefreshing(false);
      toast({
        title: "Vendas atualizadas",
        description: "Os dados foram atualizados com sucesso",
      });
    }, 500);
  };
  
  const handleImport = () => {
    importDialog.open();
  };
  
  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão exportados e enviados por email",
    });
  };
  
  const handleFilter = () => {
    // Filter logic would go here
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram filtrados",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Minhas Vendas"
        description="Gerenciamento das vendas de seus clientes"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={importDialog.open}>
              <FileUp className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button onClick={createSaleDialog.open}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        }
      />
      
      <AdminSalesLayout
        isRefreshing={isRefreshing}
        onRefresh={refreshSales}
        onImport={handleImport}
        onExport={handleExport}
      >
        <Card>
          <CardContent className="p-6">
            <AdminSalesFilters 
              filters={filters}
              onFilter={handleFilter}
            />
            
            <AdminSalesContent 
              sales={sales}
              filters={filters}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              itemsPerPage={10}
            />
          </CardContent>
        </Card>
      </AdminSalesLayout>
      
      {/* Dialogs would be here */}
    </div>
  );
};

export default PartnerSalesPage;
