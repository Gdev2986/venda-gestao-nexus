
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { FileUp, Plus, Download, RefreshCw, Filter } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { Card, CardContent } from "@/components/ui/card";
import AdminSalesLayout from "@/components/admin/sales/AdminSalesLayout";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

// Sample data for demonstration
export interface SalesData {
  id: string;
  date: string;
  amount: number;
  client: string;
  status: string;
}

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
            <div className="space-y-4">
              {/* Simple filters section */}
              <div className="flex flex-wrap gap-4 items-center">
                <input
                  type="text"
                  placeholder="Buscar vendas..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todos os status</option>
                  <option value="completed">Concluídas</option>
                  <option value="pending">Pendentes</option>
                </select>
                <Button variant="outline" onClick={handleFilter}>
                  <Filter className="mr-2 h-4 w-4" />
                  Aplicar Filtros
                </Button>
              </div>

              {/* Simple sales table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Data</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cliente</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="border border-gray-300 px-4 py-2">{sale.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{sale.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{sale.client}</td>
                        <td className="border border-gray-300 px-4 py-2">R$ {sale.amount.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            sale.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sale.status === 'completed' ? 'Concluída' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </AdminSalesLayout>
      
      {/* Dialogs would be here */}
    </div>
  );
};

export default PartnerSalesPage;
