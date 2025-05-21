
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileDown, PieChart, BarChart3 } from "lucide-react";
import { useState } from "react";
import RequestsReportView from "@/components/logistics/reports/RequestsReportView";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DateRange } from "react-day-picker";

const AdminReports = () => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Handler for DateRange changes that ensures type compatibility
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      // Ensure the 'to' property exists, otherwise use 'from' as fallback
      setDateRange({
        from: range.from || new Date(),
        to: range.to || range.from || new Date(),
      });
    }
  };

  // Mock data para os gráficos
  const salesData = [
    { name: "Jan", sales: 125000 },
    { name: "Fev", sales: 152000 },
    { name: "Mar", sales: 189000 },
    { name: "Abr", sales: 204000 },
    { name: "Mai", sales: 217000 },
    { name: "Jun", sales: 240000 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios" 
        description="Relatórios e análises de vendas, operações e financeiro"
      />

      <Tabs defaultValue="sales">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="report-type">Tipo de Relatório</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type" className="w-full mt-1">
                      <SelectValue placeholder="Selecione o tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Vendas Totais</SelectItem>
                      <SelectItem value="payment-methods">Por Método de Pagamento</SelectItem>
                      <SelectItem value="installments">Por Parcelamento</SelectItem>
                      <SelectItem value="clients">Por Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date-range">Período</Label>
                  <DatePickerWithRange 
                    className="w-full mt-1" 
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button className="flex-1 md:mt-7">
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" size="icon" className="md:mt-7">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']} />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <RequestsReportView />
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="financial-report-type">Tipo de Relatório</Label>
                  <Select>
                    <SelectTrigger id="financial-report-type" className="w-full mt-1">
                      <SelectValue placeholder="Selecione o tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Receita</SelectItem>
                      <SelectItem value="expenses">Despesas</SelectItem>
                      <SelectItem value="profit">Lucro</SelectItem>
                      <SelectItem value="commissions">Comissões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="financial-date-range">Período</Label>
                  <DatePickerWithRange 
                    className="w-full mt-1" 
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button className="flex-1 md:mt-7">
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" size="icon" className="md:mt-7">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Selecione os filtros e gere um relatório</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escolha o tipo de relatório e o período desejado para visualizar os dados financeiros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="client-report-type">Tipo de Relatório</Label>
                  <Select>
                    <SelectTrigger id="client-report-type" className="w-full mt-1">
                      <SelectValue placeholder="Selecione o tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acquisition">Aquisição de Clientes</SelectItem>
                      <SelectItem value="retention">Retenção de Clientes</SelectItem>
                      <SelectItem value="activity">Atividade de Clientes</SelectItem>
                      <SelectItem value="segment">Segmentação de Clientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="client-date-range">Período</Label>
                  <DatePickerWithRange 
                    className="w-full mt-1" 
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button className="flex-1 md:mt-7">
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" size="icon" className="md:mt-7">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Selecione os filtros e gere um relatório</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escolha o tipo de relatório e o período desejado para visualizar os dados de clientes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
