
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { SalesFilterParams } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock data for partner sales
const MOCK_SALES = [
  {
    id: "1",
    code: "VENDA-001",
    client_name: "Restaurante Bom Sabor",
    client_id: "client-001",
    terminal: "POS-12345",
    date: "2023-05-10T14:30:00Z",
    payment_method: "credit",
    gross_amount: 1500.00,
    net_amount: 1455.00,
    status: "completed"
  },
  {
    id: "2",
    code: "VENDA-002",
    client_name: "Loja Tech Mais",
    client_id: "client-002",
    terminal: "POS-54321",
    date: "2023-05-11T09:15:00Z",
    payment_method: "debit",
    gross_amount: 890.50,
    net_amount: 872.69,
    status: "completed"
  },
  {
    id: "3",
    code: "VENDA-003",
    client_name: "Restaurante Bom Sabor",
    client_id: "client-001",
    terminal: "POS-12345",
    date: "2023-05-12T18:45:00Z",
    payment_method: "pix",
    gross_amount: 2100.00,
    net_amount: 2058.00,
    status: "completed"
  },
  {
    id: "4",
    code: "VENDA-004",
    client_name: "Loja Tech Mais",
    client_id: "client-002",
    terminal: "POS-54321",
    date: "2023-05-13T11:20:00Z",
    payment_method: "credit",
    gross_amount: 1250.75,
    net_amount: 1213.23,
    status: "processing"
  }
];

const PartnerSales = () => {
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>();
  
  // Filtered sales based on filters
  const filteredSales = MOCK_SALES.filter(sale => {
    if (filters.search && 
        !sale.client_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !sale.code.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.paymentMethod && sale.payment_method !== filters.paymentMethod) {
      return false;
    }
    
    if (filters.minAmount && sale.gross_amount < filters.minAmount) {
      return false;
    }
    
    if (dateRange?.from) {
      const saleDate = new Date(sale.date);
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (saleDate < fromDate) {
        return false;
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        
        if (saleDate > toDate) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: SalesFilterParams) => {
    setFilters(newFilters);
  };

  // Handle date range changes
  const handleDateRangeChange = (range: { from: Date; to?: Date } | undefined) => {
    setDateRange(range);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setDateRange(undefined);
  };

  // Get payment method display text
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit":
        return "Crédito";
      case "debit":
        return "Débito";
      case "pix":
        return "PIX";
      default:
        return method;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Vendas" 
        description="Acompanhe as vendas dos seus clientes vinculados"
      />
      
      <PageWrapper>
        <Card className="mb-6">
          <AdminSalesFilters
            filters={filters}
            dateRange={dateRange}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={handleClearFilters}
          />
        </Card>
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
            <CardTitle>Histórico de Vendas</CardTitle>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSales.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Nenhuma venda encontrada</h3>
                <p className="text-muted-foreground mt-1">
                  Não encontramos vendas com os filtros aplicados.
                </p>
                {(filters.search || filters.paymentMethod || filters.minAmount || dateRange) && (
                  <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Terminal</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor Bruto</TableHead>
                      <TableHead className="text-right">Valor Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.code}</TableCell>
                        <TableCell>{sale.client_name}</TableCell>
                        <TableCell>{sale.terminal}</TableCell>
                        <TableCell>{formatDate(new Date(sale.date))}</TableCell>
                        <TableCell>{getPaymentMethodText(sale.payment_method)}</TableCell>
                        <TableCell>
                          <Badge variant={sale.status === "completed" ? "success" : "warning"}>
                            {sale.status === "completed" ? "Finalizada" : "Processando"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.gross_amount)}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{formatCurrency(sale.net_amount)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
};

export default PartnerSales;
