
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { FileUp, Plus, DollarSign, RefreshCcw, CreditCard } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import AdminSalesContent, { SalesData } from "@/components/admin/sales/AdminSalesContent";
import { StyledCard } from "@/components/ui/styled-card";

export interface SalesFilters {
  search: string;
  status: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

const defaultFilters: SalesFilters = {
  search: "",
  status: "all",
  dateRange: {
    from: addDays(new Date(), -30),
    to: new Date(),
  }
};

// Sample data for demonstration
const mockSalesData: SalesData[] = [
  { id: '1', date: '2025-01-01', amount: 150, client: 'Company A', status: 'completed' },
  { id: '2', date: '2025-01-02', amount: 200, client: 'Company B', status: 'pending' },
  { id: '3', date: '2025-01-03', amount: 300, client: 'Company C', status: 'completed' },
];

const AdminSalesPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<SalesFilters>(defaultFilters);
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
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Calculate some metrics
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const completedSales = sales.filter(sale => sale.status === 'completed');
  const pendingSales = sales.filter(sale => sale.status === 'pending');
  const averageSale = totalSales / (sales.length || 1);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas"
        description="Gerenciamento de vendas e relatórios"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport}>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StyledCard 
          title="Total de Vendas" 
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(totalSales)}
          </div>
          <p className="text-sm text-muted-foreground">Valor total em vendas</p>
        </StyledCard>
        
        <StyledCard 
          title="Vendas Concluídas" 
          icon={<DollarSign className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">{completedSales.length}</div>
          <p className="text-sm text-muted-foreground">Vendas finalizadas</p>
        </StyledCard>
        
        <StyledCard 
          title="Vendas Pendentes" 
          icon={<RefreshCcw className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">{pendingSales.length}</div>
          <p className="text-sm text-muted-foreground">Aguardando finalização</p>
        </StyledCard>
        
        <StyledCard 
          title="Ticket Médio" 
          icon={<CreditCard className="h-4 w-4 text-purple-500" />}
          borderColor="border-purple-500"
        >
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(averageSale)}
          </div>
          <p className="text-sm text-muted-foreground">Valor médio por venda</p>
        </StyledCard>
      </div>

      <StyledCard borderColor="border-gray-200">
        <div className="space-y-6">
          <AdminSalesFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
          
          <AdminSalesContent 
            sales={sales}
            filters={filters}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            itemsPerPage={10}
          />
        </div>
      </StyledCard>
      
      {/* Dialogs would be here */}
    </div>
  );
};

export default AdminSalesPage;
