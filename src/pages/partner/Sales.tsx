
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SalesTable from "@/components/sales/SalesTable";
import { Sale, PaymentMethod, SalesFilterParams } from "@/types";
import { CalendarRange, FileText, Download, Search } from "lucide-react";
import SalesFilters from "@/components/sales/SalesFilters";

const PartnerSales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [date, setDate] = useState<{ from: Date; to?: Date } | undefined>(undefined);

  // Mock data - to be replaced with real API calls
  useEffect(() => {
    const mockSales: Sale[] = [
      {
        id: "1",
        code: "VND0001",
        terminal: "POS-1234",
        client_name: "Restaurante Silva",
        gross_amount: 1200,
        net_amount: 1140,
        date: new Date().toISOString(),
        payment_method: PaymentMethod.CREDIT,
        client_id: "c1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        code: "VND0002",
        terminal: "POS-5678",
        client_name: "Mercado Central",
        gross_amount: 850,
        net_amount: 807.5,
        date: new Date().toISOString(),
        payment_method: PaymentMethod.DEBIT,
        client_id: "c2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    setTimeout(() => {
      setSales(mockSales);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDateChange = (dateRange: { from: Date; to?: Date } | undefined) => {
    setDate(dateRange);
  };
  
  const handleClearFilters = () => {
    setFilters({});
    setDate(undefined);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div>
      <PageHeader 
        title="Vendas" 
        description="Acompanhe as vendas realizadas pelos seus clientes"
      >
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar vendas..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SalesFilters 
              date={date}
              filters={filters}
              onDateChange={handleDateChange}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onExport={handleExport}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarRange className="h-5 w-5" />
                Histórico de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <SalesTable 
                sales={sales} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default PartnerSales;
