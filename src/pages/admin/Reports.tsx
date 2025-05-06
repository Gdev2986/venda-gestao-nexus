
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  Filter,
  Plus
} from "lucide-react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";

// Mock data for the reports
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

const clientGrowthByMonth = [
  { name: 'Jan', total: 120 },
  { name: 'Fev', total: 125 },
  { name: 'Mar', total: 130 },
  { name: 'Abr', total: 140 },
  { name: 'Mai', total: 145 },
  { name: 'Jun', total: 150 },
  { name: 'Jul', total: 160 },
  { name: 'Ago', total: 165 },
  { name: 'Set', total: 172 },
  { name: 'Out', total: 180 },
  { name: 'Nov', total: 190 },
  { name: 'Dez', total: 200 },
];

const expensesByCategory = [
  { name: 'Pessoal', value: 18900 },
  { name: 'Marketing', value: 8500 },
  { name: 'Infraestrutura', value: 7200 },
  { name: 'Software', value: 4500 },
  { name: 'Administrativo', value: 3680 },
];

// Mock data for expenses table
const expensesData = Array.from({ length: 100 }, (_, i) => ({
  id: `EXP-${1000 + i}`,
  description: `Despesa ${i + 1}`,
  amount: Math.floor(Math.random() * 10000) + 500,
  category: ['Pessoal', 'Marketing', 'Infraestrutura', 'Software', 'Administrativo'][Math.floor(Math.random() * 5)],
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  recurrence: ['Única', 'Mensal', 'Anual'][Math.floor(Math.random() * 3)],
}));

const AdminReports = () => {
  const [period, setPeriod] = useState('current');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseRecurrence, setExpenseRecurrence] = useState('Única');
  const [filteredExpenses, setFilteredExpenses] = useState(expensesData);
  const [recurrenceFilter, setRecurrenceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 50;
  const { toast } = useToast();
  
  // Filter expenses based on selected recurrence and search term
  useEffect(() => {
    let filtered = expensesData;
    
    if (recurrenceFilter) {
      filtered = filtered.filter(expense => expense.recurrence === recurrenceFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredExpenses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [recurrenceFilter, searchTerm]);
  
  // Handle period selection
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined = today;
    
    switch(value) {
      case 'current':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last':
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'quarter':
        from = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        break;
      case 'year':
        from = new Date(today.getFullYear(), 0, 1);
        break;
      case 'custom':
        // Don't change the date range for custom
        return;
      default:
        from = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    setDateRange({ from, to });
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Relatório exportado",
        description: "O arquivo foi salvo com sucesso"
      });
    }, 1500);
  };
  
  const handleAddExpense = () => {
    if (!expenseDescription || !expenseAmount || !expenseCategory) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar a despesa",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Despesa adicionada",
      description: "A nova despesa foi registrada com sucesso"
    });
    
    // Reset form and close dialog
    setExpenseDescription('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseRecurrence('Única');
    setIsAddExpenseOpen(false);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const moneyFormatter = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <PageWrapper>
      <PageHeader 
        title="Relatórios Financeiros" 
        description="Análise detalhada das informações financeiras e operacionais"
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={period} onValueChange={handlePeriodChange}>
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
          
          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[220px] justify-start text-left">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      "Selecione um período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range as {from: Date, to: Date | undefined})}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Buscar..." 
              className="max-w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 124.500,00</div>
            <p className="text-sm text-green-600 mt-2">+12% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">200</div>
            <p className="text-sm text-green-600 mt-2">+8 novos neste mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.780,00</div>
            <p className="text-sm text-red-600 mt-2">+5% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Vendas Totais</CardTitle>
                <CardDescription>Evolução mensal das vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart 
                    data={revenueByMonth} 
                    dataKey="total"
                    xAxisKey="name"
                    formatter={moneyFormatter}
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    formatter={moneyFormatter}
                    height={280}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
                <CardDescription>Evolução mensal da base de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={clientGrowthByMonth.slice(-6)} 
                    dataKey="total"
                    xAxisKey="name"
                    formatter={(value) => value.toString()}
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Indicadores de Desempenho</CardTitle>
                <CardDescription>Métricas essenciais do negócio</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Despesas</CardTitle>
                <CardDescription>Gerenciamento de despesas do negócio</CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={recurrenceFilter} onValueChange={setRecurrenceFilter}>
                  <SelectTrigger className="min-w-[180px]">
                    <SelectValue placeholder="Filtrar por recorrência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="Única">Única</SelectItem>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes da despesa para registro.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expense-description">Descrição</Label>
                        <Input
                          id="expense-description"
                          value={expenseDescription}
                          onChange={(e) => setExpenseDescription(e.target.value)}
                          placeholder="Descrição da despesa"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="expense-amount">Valor (R$)</Label>
                        <Input
                          id="expense-amount"
                          type="number"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          placeholder="0,00"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="expense-category">Categoria</Label>
                        <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                          <SelectTrigger id="expense-category">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pessoal">Pessoal</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Administrativo">Administrativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="expense-recurrence">Recorrência</Label>
                        <Select value={expenseRecurrence} onValueChange={setExpenseRecurrence}>
                          <SelectTrigger id="expense-recurrence">
                            <SelectValue placeholder="Tipo de recorrência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Única">Única</SelectItem>
                            <SelectItem value="Mensal">Mensal</SelectItem>
                            <SelectItem value="Anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddExpense}>
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Descrição</th>
                        <th className="py-3 px-4 text-left">Categoria</th>
                        <th className="py-3 px-4 text-left">Valor</th>
                        <th className="py-3 px-4 text-left">Data</th>
                        <th className="py-3 px-4 text-left">Recorrência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentExpenses.map((expense, index) => (
                        <tr 
                          key={expense.id} 
                          className={`border-b ${index % 2 ? 'bg-muted/30' : 'bg-white'}`}
                        >
                          <td className="py-3 px-4">{expense.id}</td>
                          <td className="py-3 px-4">{expense.description}</td>
                          <td className="py-3 px-4">{expense.category}</td>
                          <td className="py-3 px-4">{moneyFormatter(expense.amount)}</td>
                          <td className="py-3 px-4">{format(expense.date, 'dd/MM/yyyy')}</td>
                          <td className="py-3 px-4">{expense.recurrence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="text-sm">
                    Página {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Clientes</CardTitle>
              <CardDescription>Evolução da base de clientes ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart 
                  data={clientGrowthByMonth} 
                  dataKey="total"
                  xAxisKey="name"
                  formatter={(value) => value.toString()}
                  height={320}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segmentação de Clientes</CardTitle>
                <CardDescription>Distribuição por tipo de conta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={[
                      { name: 'Enterprise', value: 35 },
                      { name: 'Mid-Market', value: 42 },
                      { name: 'Small Business', value: 23 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    formatter={(value) => `${value}%`}
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Cliente</CardTitle>
                <CardDescription>Métricas principais dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                    <p className="text-xl font-medium mt-1">94.3%</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Tempo Médio como Cliente</p>
                    <p className="text-xl font-medium mt-1">2.7 anos</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Valor Médio por Cliente</p>
                    <p className="text-xl font-medium mt-1">R$ 622,50/mês</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Taxa de Crescimento</p>
                    <p className="text-xl font-medium mt-1">5.3% ao mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AdminReports;
