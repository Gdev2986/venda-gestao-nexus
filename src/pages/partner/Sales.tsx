
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "@/types";
import { CalendarRange, FileText, Download } from "lucide-react";
import { AdminSalesFilters } from "@/components/admin/sales/AdminSalesFilters";

const PartnerSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock sales data
          const mockSalesData: Sale[] = [
            {
              id: "s1",
              client_id: "c1",
              client_name: "Empresa Cliente ABC",
              code: "VDA001",
              terminal: "TERM001",
              date: new Date().toISOString(),
              payment_method: "CREDIT",
              gross_amount: 1500,
              net_amount: 1425,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: "s2",
              client_id: "c2",
              client_name: "Empresa Cliente XYZ",
              code: "VDA002",
              terminal: "TERM001",
              date: new Date(Date.now() - 86400000).toISOString(),
              payment_method: "PIX",
              gross_amount: 980,
              net_amount: 980,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: "s3",
              client_id: "c1",
              client_name: "Empresa Cliente ABC",
              code: "VDA003",
              terminal: "TERM002",
              date: new Date(Date.now() - 172800000).toISOString(),
              payment_method: "DEBIT",
              gross_amount: 750,
              net_amount: 735,
              created_at: new Date(Date.now() - 172800000).toISOString(),
              updated_at: new Date(Date.now() - 172800000).toISOString()
            }
          ];
          
          setSales(mockSalesData);
          setFilteredSales(mockSalesData);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("Error fetching sales:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as vendas."
        });
        setIsLoading(false);
      }
    };
    
    fetchSales();
  }, [toast]);
  
  const handleFilter = (filters: any) => {
    let filtered = [...sales];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(sale => 
        sale.code.toLowerCase().includes(searchTerm) ||
        sale.client_name.toLowerCase().includes(searchTerm) ||
        sale.terminal.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.paymentMethod) {
      filtered = filtered.filter(sale => 
        sale.payment_method === filters.paymentMethod
      );
    }
    
    setFilteredSales(filtered);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const totalSales = filteredSales.reduce((acc, sale) => acc + sale.gross_amount, 0);
  
  return (
    <div>
      <PageHeader 
        title="Vendas"
        description="Acompanhe todas as vendas dos seus clientes"
      />
      
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total de Vendas</div>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : filteredSales.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Valor Total</div>
              <div className="text-3xl font-bold text-green-600">
                {isLoading ? "..." : formatCurrency(totalSales)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Média por Venda</div>
              <div className="text-3xl font-bold">
                {isLoading ? "..." : formatCurrency(filteredSales.length ? totalSales / filteredSales.length : 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSalesFilters onFilter={handleFilter} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>Todas as vendas dos seus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-100 rounded"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
              </div>
            ) : filteredSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2">Código</th>
                      <th className="pb-2">Data</th>
                      <th className="pb-2">Cliente</th>
                      <th className="pb-2">Terminal</th>
                      <th className="pb-2">Pagamento</th>
                      <th className="pb-2 text-right">Valor Bruto</th>
                      <th className="pb-2 text-right">Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map(sale => (
                      <tr key={sale.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{sale.code}</td>
                        <td className="py-3">{formatDate(sale.date)}</td>
                        <td className="py-3">{sale.client_name}</td>
                        <td className="py-3">{sale.terminal}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            sale.payment_method === "PIX" 
                              ? "bg-green-100 text-green-800" 
                              : sale.payment_method === "CREDIT"
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-purple-100 text-purple-800"
                          }`}>
                            {sale.payment_method === "PIX" 
                              ? "PIX" 
                              : sale.payment_method === "CREDIT" 
                                ? "Crédito" 
                                : "Débito"}
                          </span>
                        </td>
                        <td className="py-3 text-right">{formatCurrency(sale.gross_amount)}</td>
                        <td className="py-3 text-right">{formatCurrency(sale.net_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Nenhuma venda encontrada para os filtros selecionados
              </p>
            )}
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
};

export default PartnerSales;
