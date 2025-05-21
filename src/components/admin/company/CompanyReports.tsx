
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { BarChart, LineChart } from "@/components/charts";
import { 
  BarChart3, 
  DollarSign, 
  Download, 
  Calendar, 
  TrendingUp,
  FileText 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const CompanyReports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cashBalance, setCashBalance] = useState(125000);
  const [projectedCash, setProjectedCash] = useState(178500);
  const [outstandingBalance, setOutstandingBalance] = useState(42800);
  const [officeCommission, setOfficeCommission] = useState(15600);
  
  // Dados dos gráficos (simulados)
  const [cashFlowData, setCashFlowData] = useState([
    { name: "Jan", entrada: 42000, saida: 28000, saldo: 14000 },
    { name: "Fev", entrada: 38000, saida: 30000, saldo: 8000 },
    { name: "Mar", entrada: 45000, saida: 28500, saldo: 16500 },
    { name: "Abr", entrada: 40000, saida: 27000, saldo: 13000 },
    { name: "Mai", entrada: 52000, saida: 31000, saldo: 21000 },
    { name: "Jun", entrada: 48000, saida: 29000, saldo: 19000 }
  ]);
  
  const [clientBalanceData, setClientBalanceData] = useState([
    { name: "Jan", pendente: 35000, recebido: 120000 },
    { name: "Fev", pendente: 38000, recebido: 118000 },
    { name: "Mar", pendente: 42000, recebido: 125000 },
    { name: "Abr", pendente: 40000, recebido: 130000 },
    { name: "Mai", pendente: 37000, recebido: 140000 },
    { name: "Jun", pendente: 42800, recebido: 142000 }
  ]);

  const handleDatePreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDateRange({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      case "last7days":
        setDateRange({ from: subDays(today, 6), to: today });
        break;
      case "last30days":
        setDateRange({ from: subDays(today, 29), to: today });
        break;
      case "thisMonth":
        setDateRange({ from: startOfMonth(today), to: today });
        break;
      case "lastMonth":
        const firstDayLastMonth = startOfMonth(subMonths(today, 1));
        const lastDayLastMonth = endOfMonth(firstDayLastMonth);
        setDateRange({ from: firstDayLastMonth, to: lastDayLastMonth });
        break;
      default:
        break;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const fetchReportData = () => {
    setIsLoading(true);
    
    // Simulação de carregamento de dados (seria substituído por chamada à API)
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Relatório atualizado",
        description: `Dados atualizados para o período de ${format(dateRange.from, 'dd/MM/yyyy')} a ${format(dateRange.to, 'dd/MM/yyyy')}`
      });
    }, 1000);
  };
  
  const handleExportReport = (format: string) => {
    toast({
      title: `Exportando relatório em ${format}`,
      description: "O download começará em instantes..."
    });
  };
  
  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      {/* Filtros e controles */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo de Relatório</h3>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="cashflow">Fluxo de Caixa</SelectItem>
                  <SelectItem value="clients">Saldo de Clientes</SelectItem>
                  <SelectItem value="commission">Comissões</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Período</h3>
              <div className="flex items-center space-x-2">
                <DatePicker 
                  selected={dateRange.from}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Data inicial"
                />
                <span>até</span>
                <DatePicker 
                  selected={dateRange.to}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Data final"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Predefinições</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDatePreset("today")}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDatePreset("last7days")}>
                  7 dias
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDatePreset("thisMonth")}>
                  Este mês
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDatePreset("lastMonth")}>
                  Mês passado
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" className="mr-2" onClick={() => handleExportReport("csv")}>
              <FileText className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportReport("pdf")}>
              <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold text-green-500">{formatCurrency(cashBalance)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Atualizado hoje</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Provisão de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold text-blue-500">{formatCurrency(projectedCash)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Projeção para 30 dias</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-orange-500 mr-2" />
              <div className="text-2xl font-bold text-orange-500">{formatCurrency(outstandingBalance)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pendente de recebimento</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissão Escritório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <div className="text-2xl font-bold text-purple-500">{formatCurrency(officeCommission)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">No período selecionado</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Conteúdo do relatório */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "overview" && "Visão Geral da Empresa"}
            {reportType === "cashflow" && "Fluxo de Caixa"}
            {reportType === "clients" && "Saldo de Clientes"}
            {reportType === "commission" && "Comissões do Escritório"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-4 text-sm text-muted-foreground">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <div>
              {reportType === "overview" || reportType === "cashflow" ? (
                <div className="h-[400px]">
                  <LineChart 
                    data={cashFlowData}
                    xAxisKey="name"
                    series={[
                      { dataKey: "entrada", name: "Entradas", color: "#4ade80" },
                      { dataKey: "saida", name: "Saídas", color: "#f43f5e" },
                      { dataKey: "saldo", name: "Saldo", color: "#8B5CF6" }
                    ]}
                  />
                </div>
              ) : null}
              
              {reportType === "clients" && (
                <div className="h-[400px]">
                  <BarChart
                    data={clientBalanceData}
                    xAxisKey="name"
                    series={[
                      { dataKey: "pendente", name: "Pendente", color: "#f97316" },
                      { dataKey: "recebido", name: "Recebido", color: "#4ade80" }
                    ]}
                  />
                </div>
              )}
              
              {reportType === "commission" && (
                <div className="h-[400px]">
                  <BarChart
                    data={clientBalanceData.map(item => ({
                      name: item.name,
                      comissao: item.recebido * 0.11
                    }))}
                    xAxisKey="name"
                    series={[
                      { dataKey: "comissao", name: "Comissão", color: "#9b87f5" }
                    ]}
                  />
                </div>
              )}
              
              {/* Tabela detalhada abaixo do gráfico */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Dados Detalhados</h3>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Período</th>
                        {reportType === "overview" || reportType === "cashflow" ? (
                          <>
                            <th className="px-4 py-2 text-right">Entradas</th>
                            <th className="px-4 py-2 text-right">Saídas</th>
                            <th className="px-4 py-2 text-right">Saldo</th>
                          </>
                        ) : reportType === "clients" ? (
                          <>
                            <th className="px-4 py-2 text-right">Pendente</th>
                            <th className="px-4 py-2 text-right">Recebido</th>
                            <th className="px-4 py-2 text-right">Total</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-2 text-right">Faturamento</th>
                            <th className="px-4 py-2 text-right">Taxa</th>
                            <th className="px-4 py-2 text-right">Comissão</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(reportType === "overview" || reportType === "cashflow") && 
                        cashFlowData.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2 text-right text-green-600">{formatCurrency(item.entrada)}</td>
                            <td className="px-4 py-2 text-right text-red-600">{formatCurrency(item.saida)}</td>
                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.saldo)}</td>
                          </tr>
                        ))
                      }
                      
                      {reportType === "clients" && 
                        clientBalanceData.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2 text-right text-orange-500">{formatCurrency(item.pendente)}</td>
                            <td className="px-4 py-2 text-right text-green-600">{formatCurrency(item.recebido)}</td>
                            <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.pendente + item.recebido)}</td>
                          </tr>
                        ))
                      }
                      
                      {reportType === "commission" && 
                        clientBalanceData.map((item, index) => {
                          const taxRate = 0.11;
                          const commission = item.recebido * taxRate;
                          
                          return (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(item.recebido)}</td>
                              <td className="px-4 py-2 text-right">{(taxRate * 100).toFixed(1)}%</td>
                              <td className="px-4 py-2 text-right text-purple-600 font-medium">{formatCurrency(commission)}</td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyReports;
