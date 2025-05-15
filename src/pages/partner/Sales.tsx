
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sale } from "@/types";
import { CalendarRange, FileText, Download } from "lucide-react";
import AdminSalesFilters from "@/components/admin/sales/AdminSalesFilters";

const PartnerSales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("hoje");
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Placeholder for API data
  const salesTotal = 5678.90;
  const salesCount = 12;
  const averageTicket = salesTotal / salesCount;
  
  return (
    <div>
      <PageHeader
        title="Vendas"
        description="Acompanhe todas as suas transações"
      >
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Gerar Extrato
          </Button>
        </div>
      </PageHeader>
      
      <PageWrapper>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {salesTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +2.1% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quantidade</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesCount}</div>
              <p className="text-xs text-muted-foreground">
                +5.1% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                -0.5% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Tabs 
            value={selectedPeriod} 
            onValueChange={setSelectedPeriod}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="hoje">Hoje</TabsTrigger>
                <TabsTrigger value="7dias">Últimos 7 dias</TabsTrigger>
                <TabsTrigger value="30dias">Últimos 30 dias</TabsTrigger>
                <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminSalesFilters onFilter={() => {}} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : sales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Data</th>
                        <th className="text-left p-2">Cliente</th>
                        <th className="text-left p-2">Terminal</th>
                        <th className="text-left p-2">Pagamento</th>
                        <th className="text-right p-2">Valor Bruto</th>
                        <th className="text-right p-2">Valor Líquido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr key={sale.id} className="border-t hover:bg-muted/50">
                          <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                          <td className="p-2">{sale.client_name}</td>
                          <td className="p-2">{sale.terminal}</td>
                          <td className="p-2">{sale.payment_method}</td>
                          <td className="p-2 text-right">
                            R$ {sale.gross_amount.toFixed(2)}
                          </td>
                          <td className="p-2 text-right">
                            R$ {sale.net_amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground">
                    Não há transações para o período selecionado. Tente mudar os filtros de busca.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </div>
  );
};

export default PartnerSales;
