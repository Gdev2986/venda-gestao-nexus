import { useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth, subYears, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ArrowUpRight, Download, Filter, Plus, Printer, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LineChart, BarChart, PieChart } from "@/components/charts";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  LineChart as RechartsLineChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from "recharts";

// Mock data for charts
const salesData = [
  { name: "Jan", total: 18000 },
  { name: "Feb", total: 16500 },
  { name: "Mar", total: 22000 },
  { name: "Apr", total: 25400 },
  { name: "May", total: 30000 },
  { name: "Jun", total: 28500 },
  { name: "Jul", total: 27000 },
  { name: "Aug", total: 32500 },
  { name: "Sep", total: 34000 },
  { name: "Oct", total: 36500 },
  { name: "Nov", total: 38000 },
  { name: "Dec", total: 42000 },
];

const expensesByCategory = [
  { name: "Aluguel", value: 5000 },
  { name: "Salários", value: 25000 },
  { name: "Marketing", value: 8000 },
  { name: "Operacional", value: 12000 },
  { name: "Licenças", value: 3500 },
];

const clientGrowthData = [
  { name: "Jan", total: 120 },
  { name: "Feb", total: 132 },
  { name: "Mar", total: 145 },
  { name: "Apr", total: 162 },
  { name: "May", total: 180 },
  { name: "Jun", total: 205 },
  { name: "Jul", total: 225 },
  { name: "Aug", total: 245 },
  { name: "Sep", total: 260 },
  { name: "Oct", total: 278 },
  { name: "Nov", total: 295 },
  { name: "Dec", total: 315 },
];

const revenueData = [
  { name: "Jan", bruto: 25000, liquido: 18000 },
  { name: "Feb", bruto: 22000, liquido: 16500 },
  { name: "Mar", bruto: 30000, liquido: 22000 },
  { name: "Apr", bruto: 34000, liquido: 25400 },
  { name: "May", bruto: 40000, liquido: 30000 },
  { name: "Jun", bruto: 38000, liquido: 28500 },
  { name: "Jul", bruto: 36000, liquido: 27000 },
  { name: "Aug", bruto: 43000, liquido: 32500 },
  { name: "Sep", bruto: 45000, liquido: 34000 },
  { name: "Oct", bruto: 48500, liquido: 36500 },
  { name: "Nov", bruto: 50000, liquido: 38000 },
  { name: "Dec", bruto: 56000, liquido: 42000 },
];

const partnerCommissions = [
  { name: "Parceiro A", value: 12500 },
  { name: "Parceiro B", value: 8700 },
  { name: "Parceiro C", value: 5800 },
  { name: "Parceiro D", value: 4200 },
  { name: "Parceiro E", value: 3100 },
];

const topClients = [
  { name: "Cliente A", value: 50000 },
  { name: "Cliente B", value: 42000 },
  { name: "Cliente C", value: 35000 },
  { name: "Cliente D", value: 28000 },
  { name: "Cliente E", value: 22000 },
];

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    description: "Aluguel escritório",
    amount: 5000,
    date: "2023-05-01",
    category: "Aluguel",
    frequency: "Mensal",
    status: "Ativa",
  },
  {
    id: "2",
    description: "Salários equipe",
    amount: 25000,
    date: "2023-05-05",
    category: "Salários",
    frequency: "Mensal",
    status: "Ativa",
  },
  {
    id: "3",
    description: "Campanha marketing digital",
    amount: 3500,
    date: "2023-05-10",
    category: "Marketing",
    frequency: "Única",
    status: "Concluída",
  },
  {
    id: "4",
    description: "Licenças software",
    amount: 1200,
    date: "2023-05-15",
    category: "Licenças",
    frequency: "Anual",
    status: "Ativa",
  },
  {
    id: "5",
    description: "Materiais de escritório",
    amount: 800,
    date: "2023-05-20",
    category: "Operacional",
    frequency: "Única",
    status: "Concluída",
  },
];

// Form schema for adding/editing expenses
const expenseFormSchema = z.object({
  description: z.string().min(3, { message: "Descrição é obrigatória" }),
  amount: z.string().min(1, { message: "Valor é obrigatório" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  category: z.string({ required_error: "Categoria é obrigatória" }),
  frequency: z.string({ required_error: "Frequência é obrigatória" }),
});

const AdminReports = () => {
  // Date range states
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [dateRange, setDateRange] = useState<string>("current");
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      date: new Date(),
      category: "",
      frequency: "Única",
    },
  });

  // Function to handle date range selection
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const now = new Date();
    
    switch (value) {
      case "current":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "last":
        const lastMonth = subMonths(now, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "quarter":
        setStartDate(subMonths(now, 3));
        setEndDate(now);
        break;
      case "year":
        setStartDate(startOfYear(now));
        setEndDate(now);
        break;
      case "lastyear":
        const lastYear = subYears(now, 1);
        setStartDate(startOfYear(lastYear));
        setEndDate(endOfYear(lastYear));
        break;
      case "custom":
        // Custom dates are handled by the date picker directly
        break;
      default:
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
    }
  };

  const endOfYear = (date: Date): Date => {
    return new Date(date.getFullYear(), 11, 31);
  };

  // Handler for adding/editing expense
  const onSubmitExpense = (data: z.infer<typeof expenseFormSchema>) => {
    const newExpense = {
      id: editingExpenseId || Date.now().toString(),
      description: data.description,
      amount: parseFloat(data.amount),
      date: format(data.date, "yyyy-MM-dd"),
      category: data.category,
      frequency: data.frequency,
      status: "Ativa",
    };

    if (editingExpenseId) {
      setExpenses(expenses.map(exp => exp.id === editingExpenseId ? newExpense : exp));
      setEditingExpenseId(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }
    
    setIsAddingExpense(false);
    form.reset();
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      form.setValue("description", expense.description);
      form.setValue("amount", expense.amount.toString());
      form.setValue("date", new Date(expense.date));
      form.setValue("category", expense.category);
      form.setValue("frequency", expense.frequency);
      setEditingExpenseId(id);
      setIsAddingExpense(true);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate KPIs
  const totalRevenue = salesData.reduce((sum, item) => sum + item.total, 0);
  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.value, 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = (netProfit / totalRevenue) * 100;
  const totalSales = 3245;
  const totalPaymentRequests = 1870;
  const totalCommissions = partnerCommissions.reduce((sum, item) => sum + item.value, 0);
  const customerGrowth = ((clientGrowthData[clientGrowthData.length - 1].total - clientGrowthData[0].total) / clientGrowthData[0].total) * 100;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios" 
        description="Visualize e exporte indicadores financeiros e operacionais"
      />
      
      {/* Date picker and export buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Mês atual</SelectItem>
              <SelectItem value="last">Mês anterior</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
              <SelectItem value="lastyear">Ano anterior</SelectItem>
              <SelectItem value="custom">Período personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === "custom" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[130px] pl-3 text-left font-normal">
                    {format(startDate, "dd/MM/yyyy")}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <span className="self-center">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[130px] pl-3 text-left font-normal">
                    {format(endDate, "dd/MM/yyyy")}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Exportar CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer size={16} />
            Exportar PDF
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span> em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-red-500" />
              <span className="text-red-500">+5%</span> em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+18%</span> em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{margin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+3.2%</span> em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crescimento de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Total de {clientGrowthData[clientGrowthData.length - 1].total} clientes ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">Ticket médio: {formatCurrency(totalRevenue / totalSales)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagamentos Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaymentRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">~{Math.round(totalPaymentRequests / 12)} por mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissões Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
            <p className="text-xs text-muted-foreground mt-1">5 parceiros ativos</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for main content */}
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="partners">Parceiros</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
                <CardDescription>Evolução da receita no período</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <LineChart data={salesData} dataKey="total" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receita Bruta vs. Líquida</CardTitle>
                <CardDescription>Comparativo mensal</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat("pt-BR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)}
                      />
                      <RechartsTooltip 
                        formatter={(value: any) => (
                          new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(value)
                        )}
                      />
                      <Legend />
                      <Bar name="Receita Bruta" dataKey="bruto" fill="#8884d8" />
                      <Bar name="Receita Líquida" dataKey="liquido" fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
                <CardDescription>Evolução da base de clientes</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <LineChart data={clientGrowthData} dataKey="total" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição das despesas</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <PieChart data={expensesByCategory} dataKey="value" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestão de Despesas</h3>
            <Button onClick={() => { form.reset(); setIsAddingExpense(true); setEditingExpenseId(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
          
          {isAddingExpense && (
            <Card>
              <CardHeader>
                <CardTitle>{editingExpenseId ? "Editar Despesa" : "Nova Despesa"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitExpense)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input placeholder="Descrição da despesa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0,00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className="pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Aluguel">Aluguel</SelectItem>
                                <SelectItem value="Salários">Salários</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Operacional">Operacional</SelectItem>
                                <SelectItem value="Licenças">Licenças</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a frequência" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Única">Única</SelectItem>
                                <SelectItem value="Mensal">Mensal</SelectItem>
                                <SelectItem value="Trimestral">Trimestral</SelectItem>
                                <SelectItem value="Semestral">Semestral</SelectItem>
                                <SelectItem value="Anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={() => setIsAddingExpense(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingExpenseId ? "Salvar Alterações" : "Adicionar Despesa"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Despesas</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas categorias</SelectItem>
                      <SelectItem value="Aluguel">Aluguel</SelectItem>
                      <SelectItem value="Salários">Salários</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operacional">Operacional</SelectItem>
                      <SelectItem value="Licenças">Licenças</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr>
                      <th className="py-3 px-2">Descrição</th>
                      <th className="py-3 px-2">Valor</th>
                      <th className="py-3 px-2">Data</th>
                      <th className="py-3 px-2">Categoria</th>
                      <th className="py-3 px-2">Frequência</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-border">
                        <td className="py-3 px-2">{expense.description}</td>
                        <td className="py-3 px-2">{formatCurrency(expense.amount)}</td>
                        <td className="py-3 px-2">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-2">{expense.category}</td>
                        <td className="py-3 px-2">{expense.frequency}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            expense.status === "Ativa" 
                              ? "bg-green-100 text-green-800" 
                              : expense.status === "Programada" 
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExpense(expense.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
                <CardDescription>Evolução mensal da base de clientes</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <LineChart data={clientGrowthData} dataKey="total" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Clientes por Faturamento</CardTitle>
                <CardDescription>Clientes que mais geraram receita no período</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <BarChart 
                    data={topClients} 
                    dataKey="value" 
                    layout="vertical"
                    formatter={(value) => formatCurrency(value)}
                  />
                </div>
              </Card
