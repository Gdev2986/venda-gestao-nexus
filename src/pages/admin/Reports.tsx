
import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar, 
  Line,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { 
  CalendarDays,
  Download,
  FileText,
  Filter
} from "lucide-react";

// Mock data for the report
const revenueByMonth = [
  { name: 'Jan', total: 45000 },
  { name: 'Fev', total: 52000 },
  { name: 'Mar', total: 49000 },
  { name: 'Abr', total: 63000 },
  { name: 'Mai', total: 58000 },
  { name: 'Jun', total: 72000 },
  { name: 'Jul', total: 84000 },
  { name: 'Ago', total: 78000 },
  { name: 'Set', total: 92000 },
  { name: 'Out', total: 105000 },
  { name: 'Nov', total: 113000 },
  { name: 'Dez', total: 124500 },
];

const expensesByMonth = [
  { name: 'Jan', total: 23000 },
  { name: 'Fev', total: 24500 },
  { name: 'Mar', total: 25000 },
  { name: 'Abr', total: 26700 },
  { name: 'Mai', total: 28900 },
  { name: 'Jun', total: 31200 },
  { name: 'Jul', total: 33800 },
  { name: 'Ago', total: 35500 },
  { name: 'Set', total: 38100 },
  { name: 'Out', total: 39700 },
  { name: 'Nov', total: 41200 },
  { name: 'Dez', total: 42780 },
];

const profitByMonth = [
  { name: 'Jan', total: 22000 },
  { name: 'Fev', total: 27500 },
  { name: 'Mar', total: 24000 },
  { name: 'Abr', total: 36300 },
  { name: 'Mai', total: 29100 },
  { name: 'Jun', total: 40800 },
  { name: 'Jul', total: 50200 },
  { name: 'Ago', total: 42500 },
  { name: 'Set', total: 53900 },
  { name: 'Out', total: 65300 },
  { name: 'Nov', total: 71800 },
  { name: 'Dez', total: 81720 },
];

const revenueBySource = [
  { name: 'Taxa de Transação', value: 78500 },
  { name: 'Mensalidades', value: 26000 },
  { name: 'Serviços', value: 13500 },
  { name: 'Parcerias', value: 6500 },
];

const paymentMethodDistribution = [
  { name: 'Pix', value: 45 },
  { name: 'Crédito', value: 30 },
  { name: 'Débito', value: 20 },
  { name: 'Outros', value: 5 },
];

const expensesByCategory = [
  { name: 'Pessoal', value: 18900 },
  { name: 'Marketing', value: 8500 },
  { name: 'Infraestrutura', value: 7200 },
  { name: 'Software', value: 4500 },
  { name: 'Administrativo', value: 3680 },
];

const topClients = [
  { name: 'Tech Solutions Ltd', value: 12500 },
  { name: 'Global Imports', value: 8600 },
  { name: 'Marketing Express', value: 7200 },
  { name: 'Data Solutions Inc.', value: 6100 },
  { name: 'Energy Plus Ltda.', value: 5400 },
];

const topPartners = [
  { name: 'Nexus Partners', value: 18500 },
  { name: 'Finance Allies', value: 12700 },
  { name: 'TechGrowth Partners', value: 9800 },
  { name: 'Market Expansion Group', value: 7500 },
  { name: 'Business Catalysts', value: 6200 },
];

const AdminReports = () => {
  const [period, setPeriod] = useState('current');
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      alert('Relatório exportado com sucesso!');
    }, 1500);
  };

  const moneyFormatter = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const percentFormatter = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios Administrativos" 
        description="Análise detalhada do desempenho financeiro e operacional"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Mês atual</SelectItem>
              <SelectItem value="last">Mês anterior</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
              <SelectItem value="custom">Período personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Buscar por título..." 
              className="max-w-[250px]"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={isExporting}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 124.500,00</div>
            <p className="text-sm text-green-600 mt-2">+12% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.780,00</div>
            <p className="text-sm text-red-600 mt-2">+5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 81.720,00</div>
            <p className="text-sm text-green-600 mt-2">+16% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="partners">Parceiros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <LineChart 
                  data={profitByMonth} 
                  dataKey="total"
                  xAxisKey="name"
                  formatter={moneyFormatter}
                  height={320}
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Destaques</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Taxa média de transação</p>
                      <p className="text-xl font-medium mt-1">2.4%</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Ticket médio</p>
                      <p className="text-xl font-medium mt-1">R$ 87,20</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Custo de aquisição</p>
                      <p className="text-xl font-medium mt-1">R$ 320,00</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Margem de lucro</p>
                      <p className="text-xl font-medium mt-1">65.6%</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Distribuição de Receitas</h3>
                    <div className="p-4 border rounded-md h-[300px]">
                      <PieChart 
                        data={revenueBySource}
                        dataKey="value"
                        nameKey="name"
                        formatter={moneyFormatter}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Métodos de Pagamento</h3>
                    <div className="p-4 border rounded-md h-[300px]">
                      <PieChart 
                        data={paymentMethodDistribution}
                        dataKey="value"
                        nameKey="name"
                        formatter={percentFormatter}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Projeção para o próximo mês</h3>
                  <div className="p-4 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Receita projetada</p>
                        <p className="text-xl font-medium mt-1">R$ 135.000,00</p>
                        <p className="text-xs text-green-600">+8.4%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Despesas projetadas</p>
                        <p className="text-xl font-medium mt-1">R$ 45.000,00</p>
                        <p className="text-xs text-red-600">+5.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lucro projetado</p>
                        <p className="text-xl font-medium mt-1">R$ 90.000,00</p>
                        <p className="text-xs text-green-600">+10.1%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <LineChart 
                  data={revenueByMonth} 
                  dataKey="total"
                  xAxisKey="name"
                  formatter={moneyFormatter}
                  height={320}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Comparativo Mensal</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height={320}>
                      <RechartsBarChart
                        data={revenueByMonth.slice(-6)}
                        margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => 
                            new Intl.NumberFormat("pt-BR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                        />
                        <Tooltip 
                          formatter={(value: any) => 
                            new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(value)
                          }
                        />
                        <Legend />
                        <Bar dataKey="total" name="Receita" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Fontes de Receita</h3>
                  <div className="h-80">
                    <PieChart 
                      data={revenueBySource}
                      dataKey="value"
                      nameKey="name"
                      formatter={moneyFormatter}
                      height={320}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Tendências de Crescimento</h3>
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Crescimento Anual</p>
                      <p className="text-xl font-medium mt-1">23.5%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previsão para Próximo Trimestre</p>
                      <p className="text-xl font-medium mt-1">R$ 380.000,00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Recorrente Mensal (MRR)</p>
                      <p className="text-xl font-medium mt-1">R$ 62.000,00</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <LineChart 
                  data={expensesByMonth} 
                  dataKey="total"
                  xAxisKey="name"
                  formatter={moneyFormatter}
                  height={320}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Despesas por Categoria</h3>
                  <div className="h-80">
                    <PieChart 
                      data={expensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      formatter={moneyFormatter}
                      height={320}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Tendência Mensal</h3>
                  <div className="h-80">
                    <BarChart 
                      data={expensesByMonth.slice(-6)} 
                      dataKey="total"
                      xAxisKey="name"
                      formatter={moneyFormatter}
                      height={320}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Oportunidades de Otimização</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Redução de Custos Operacionais</p>
                    <p className="text-sm text-muted-foreground mt-1">Potencial economia de R$ 3.200,00 mensais com renegociação de contratos de software.</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Eficiência em Marketing</p>
                    <p className="text-sm text-muted-foreground mt-1">Realocação de 25% do orçamento para canais com maior ROI pode melhorar resultados em até 30%.</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Automação de Processos</p>
                    <p className="text-sm text-muted-foreground mt-1">Implementação de ferramentas de automação pode reduzir custos administrativos em até 15%.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Top 5 Clientes por Receita</h3>
                <div className="h-80">
                  <BarChart 
                    data={topClients} 
                    dataKey="value"
                    xAxisKey="name"
                    formatter={moneyFormatter}
                    height={320}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Indicadores de Cliente</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                      <p className="text-xl font-medium mt-1">157</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Novos Clientes (mês)</p>
                      <p className="text-xl font-medium mt-1">12</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                      <p className="text-xl font-medium mt-1">94.3%</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Tempo Médio como Cliente</p>
                      <p className="text-xl font-medium mt-1">2.7 anos</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Segmentação</h3>
                  <div className="h-80 mb-4">
                    <PieChart 
                      data={[
                        { name: 'Enterprise', value: 35 },
                        { name: 'Mid-Market', value: 42 },
                        { name: 'Small Business', value: 23 },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      formatter={percentFormatter}
                      height={260}
                    />
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Cliente Ideal (ICP)</p>
                    <p className="text-sm text-muted-foreground mt-1">Empresas mid-market com faturamento entre R$ 5-20 milhões apresentam melhor LTV e menor CAC.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Parceiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Top 5 Parceiros por Receita Gerada</h3>
                <div className="h-80">
                  <BarChart 
                    data={topPartners} 
                    dataKey="value"
                    xAxisKey="name"
                    formatter={moneyFormatter}
                    height={320}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Indicadores de Parceria</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Parceiros Ativos</p>
                      <p className="text-xl font-medium mt-1">24</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Novos Parceiros (mês)</p>
                      <p className="text-xl font-medium mt-1">3</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Taxa de Ativação</p>
                      <p className="text-xl font-medium mt-1">78.5%</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">Comissões Pagas (mês)</p>
                      <p className="text-xl font-medium mt-1">R$ 28.700,00</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Distribuição de Parcerias</h3>
                  <div className="h-80 mb-4">
                    <PieChart 
                      data={[
                        { name: 'Estratégicos', value: 25 },
                        { name: 'Revendas', value: 45 },
                        { name: 'Indicações', value: 30 },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      formatter={percentFormatter}
                      height={260}
                    />
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Oportunidade de Expansão</p>
                    <p className="text-sm text-muted-foreground mt-1">Parcerias estratégicas têm potencial de crescimento de 40% com maior investimento em enablement.</p>
                  </div>
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
