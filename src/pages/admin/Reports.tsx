
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { 
  FileDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Search, 
  DollarSign,
  Building,
  Users,
  CreditCard
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

// Sample data for financial overview
const financialOverviewData = {
  currentBalance: 58750.45,
  projectedIncome: 32500.00,
  projectedExpenses: 18750.30,
  cashflowData: [
    { date: "Jan", income: 45000, expenses: 32000, balance: 13000 },
    { date: "Feb", income: 48000, expenses: 35000, balance: 13000 },
    { date: "Mar", income: 52000, expenses: 33000, balance: 19000 },
    { date: "Apr", income: 55000, expenses: 36000, balance: 19000 },
    { date: "May", income: 59000, expenses: 37000, balance: 22000 },
    { date: "Jun", income: 62000, expenses: 38000, balance: 24000 },
  ]
};

// Sample data for expenses
const expensesData = [
  { id: "1", name: "Aluguel", amount: 4500, category: "RENT", recurrence: "MONTHLY", nextDate: "2025-06-10" },
  { id: "2", name: "Internet", amount: 450, category: "UTILITIES", recurrence: "MONTHLY", nextDate: "2025-06-15" },
  { id: "3", name: "Salários", amount: 28000, category: "PAYROLL", recurrence: "MONTHLY", nextDate: "2025-05-30" },
  { id: "4", name: "Software", amount: 1200, category: "SERVICES", recurrence: "ANNUAL", nextDate: "2025-09-15" },
  { id: "5", name: "Equipamentos", amount: 3500, category: "SUPPLIES", recurrence: "QUARTERLY", nextDate: "2025-07-20" },
];

// Sample expense categories for chart
const expenseCategoriesData = [
  { name: "Aluguel", value: 4500, color: "#4338ca" },
  { name: "Serviços", value: 2500, color: "#3b82f6" },
  { name: "Pessoal", value: 28000, color: "#10b981" },
  { name: "Equipamentos", value: 3500, color: "#f59e0b" },
  { name: "Outros", value: 1750, color: "#6b7280" },
];

// Sample data for clients
const clientsData = [
  { id: "1", name: "Empresa ABC Ltda", balance: 3450.00, lastTransaction: "2025-05-15", status: "ACTIVE" },
  { id: "2", name: "Comércio XYZ", balance: -750.25, lastTransaction: "2025-05-10", status: "ACTIVE" },
  { id: "3", name: "Indústria QWE", balance: 12750.80, lastTransaction: "2025-05-18", status: "ACTIVE" },
  { id: "4", name: "Atacado JKL", balance: 4530.60, lastTransaction: "2025-05-12", status: "ACTIVE" },
  { id: "5", name: "Distribuidora MNO", balance: 0.00, lastTransaction: "2025-05-01", status: "INACTIVE" },
];

// Sample data for partners
const partnersData = [
  { id: "1", name: "Parceiro Alpha", balance: 4500.00, status: "ACTIVE" },
  { id: "2", name: "Parceiro Beta", balance: 2300.50, status: "ACTIVE" },
  { id: "3", name: "Parceiro Gamma", balance: 1200.80, status: "INACTIVE" },
  { id: "4", name: "Parceiro Delta", balance: 3750.25, status: "ACTIVE" },
];

// Sample data for sales
const salesData = [
  { id: "1", date: "2025-05-18", amount: 2500.00, paymentType: "PIX", client: "Empresa ABC Ltda" },
  { id: "2", date: "2025-05-18", amount: 1200.00, paymentType: "CREDIT", client: "Comércio XYZ" },
  { id: "3", date: "2025-05-17", amount: 3450.50, paymentType: "DEBIT", client: "Indústria QWE" },
  { id: "4", date: "2025-05-16", amount: 890.00, paymentType: "CREDIT", client: "Atacado JKL" },
  { id: "5", date: "2025-05-15", amount: 1320.75, paymentType: "PIX", client: "Distribuidora MNO" },
];

// Sample data for cash flow forecast
const cashFlowForecastData = [
  { month: "Jun", income: 64000, expenses: 39000, balance: 25000 },
  { month: "Jul", income: 67000, expenses: 38000, balance: 29000 },
  { month: "Aug", income: 69000, expenses: 41000, balance: 28000 },
  { month: "Sep", income: 71000, expenses: 40000, balance: 31000 },
  { month: "Oct", income: 70000, expenses: 42000, balance: 28000 },
  { month: "Nov", income: 73000, expenses: 41000, balance: 32000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const AdminReports = () => {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(clientsData);
  const [filteredSales, setFilteredSales] = useState(salesData);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const { toast } = useToast();

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredClients(clientsData.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredClients(clientsData);
    }
  }, [searchTerm]);

  // Filter sales based on payment type
  useEffect(() => {
    let filtered = salesData;
    
    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter(sale => sale.paymentType === paymentTypeFilter);
    }
    
    setFilteredSales(filtered);
  }, [paymentTypeFilter]);

  // Handle export function
  const handleExport = (type: string) => {
    toast({
      title: `Exportando ${type}`,
      description: "O arquivo será baixado em instantes."
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Relatórios Financeiros" 
        description="Visualize dados financeiros, despesas, clientes e parceiros"
      />

      <Tabs defaultValue="summary">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">Resumo Financeiro</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="clients">Saldo Clientes</TabsTrigger>
          <TabsTrigger value="partners">Saldo Parceiros</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="forecast">Previsão de Caixa</TabsTrigger>
        </TabsList>
        
        {/* RESUMO FINANCEIRO */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${financialOverviewData.currentBalance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Saldo Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${financialOverviewData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(financialOverviewData.currentBalance)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Atualizado em {formatDate(new Date().toISOString())}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpRight className="mr-2 h-5 w-5 text-green-500" />
                  Previsão de Entrada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialOverviewData.projectedIncome)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Próximos 30 dias
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowDownRight className="mr-2 h-5 w-5 text-red-500" />
                  Previsão de Saída
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(financialOverviewData.projectedExpenses)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Próximos 30 dias
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>Entradas x Saídas dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart 
                  data={financialOverviewData.cashflowData}
                  xAxisKey="date"
                  height={400}
                  formatter={(value) => formatCurrency(value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* DESPESAS */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>Por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <DoughnutChart data={expenseCategoriesData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Cadastro de Despesa</CardTitle>
                <Button size="sm">
                  Nova Despesa
                </Button>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expense-name">Nome da Despesa</Label>
                      <Input id="expense-name" placeholder="Ex: Aluguel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-amount">Valor</Label>
                      <Input id="expense-amount" placeholder="R$ 0,00" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expense-category">Categoria</Label>
                      <Select>
                        <SelectTrigger id="expense-category">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RENT">Aluguel</SelectItem>
                          <SelectItem value="UTILITIES">Serviços</SelectItem>
                          <SelectItem value="PAYROLL">Pessoal</SelectItem>
                          <SelectItem value="SUPPLIES">Equipamentos</SelectItem>
                          <SelectItem value="OTHER">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-recurrence">Recorrência</Label>
                      <Select>
                        <SelectTrigger id="expense-recurrence">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Mensal</SelectItem>
                          <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                          <SelectItem value="ANNUAL">Anual</SelectItem>
                          <SelectItem value="ONCE">Única</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Próxima Data</Label>
                    <Input id="expense-date" type="date" />
                  </div>
                  
                  <Button type="submit" className="w-full">Salvar Despesa</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Despesas Cadastradas</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport('despesas')}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Recorrência</TableHead>
                    <TableHead>Próxima Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesData.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.name}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {expense.category === "RENT" && <Building className="mr-2 h-4 w-4 text-blue-500" />}
                          {expense.category === "UTILITIES" && <ArrowUpRight className="mr-2 h-4 w-4 text-yellow-500" />}
                          {expense.category === "PAYROLL" && <Users className="mr-2 h-4 w-4 text-green-500" />}
                          {expense.category === "SERVICES" && <ArrowUpRight className="mr-2 h-4 w-4 text-purple-500" />}
                          {expense.category === "SUPPLIES" && <ArrowUpRight className="mr-2 h-4 w-4 text-orange-500" />}
                          {expense.category}
                        </div>
                      </TableCell>
                      <TableCell>{expense.recurrence}</TableCell>
                      <TableCell>{formatDate(expense.nextDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SALDO CLIENTES */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Saldo dos Clientes</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar cliente..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport('clientes')}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Saldo Atual</TableHead>
                    <TableHead>Última Movimentação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className={`font-medium ${client.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(client.balance)}
                      </TableCell>
                      <TableCell>{formatDate(client.lastTransaction)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {client.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SALDO PARCEIROS */}
        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comissões por Parceiro</CardTitle>
                <CardDescription>Total acumulado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart 
                    data={partnersData.map(p => ({ name: p.name, value: p.balance }))}
                    height={300}
                    color="#3b82f6"
                    formatter={(value) => formatCurrency(value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saldo dos Parceiros</CardTitle>
                <CardDescription>Listagem detalhada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnersData.map((partner) => (
                    <div 
                      key={partner.id}
                      className={`p-4 rounded-lg border ${partner.status === 'ACTIVE' ? 'border-green-300' : 'border-gray-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <span className={`text-sm ${partner.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'}`}>
                            {partner.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(partner.balance)}</div>
                          <span className="text-xs text-muted-foreground">Comissão total</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* RELATÓRIO DE VENDAS */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Vendas</CardTitle>
              <CardDescription>Visualização detalhada das vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div>
                    <Label htmlFor="payment-type">Tipo de Pagamento</Label>
                    <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                      <SelectTrigger id="payment-type">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="CREDIT">Crédito</SelectItem>
                        <SelectItem value="DEBIT">Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-range">Período</Label>
                    <DatePickerWithRange 
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleExport('vendas')}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo de Pagamento</TableHead>
                    <TableHead>Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {sale.paymentType === "PIX" && <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />}
                          {sale.paymentType === "CREDIT" && <CreditCard className="mr-2 h-4 w-4 text-blue-500" />}
                          {sale.paymentType === "DEBIT" && <CreditCard className="mr-2 h-4 w-4 text-purple-500" />}
                          {sale.paymentType}
                        </div>
                      </TableCell>
                      <TableCell>{sale.client}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* PREVISÃO DE CAIXA */}
        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Previsão de Caixa</CardTitle>
              <CardDescription>Previsão para os próximos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart 
                  data={cashFlowForecastData}
                  xAxisKey="month"
                  height={400}
                  formatter={(value) => formatCurrency(value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUpRight className="mr-2 h-5 w-5 text-green-500" />
                  Entradas Futuras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Valor Previsto</TableHead>
                      <TableHead>Origem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowForecastData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="font-medium text-green-600">{formatCurrency(item.income)}</TableCell>
                        <TableCell>Vendas + Recebimentos</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowDownRight className="mr-2 h-5 w-5 text-red-500" />
                  Saídas Programadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Valor Previsto</TableHead>
                      <TableHead>Destino</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowForecastData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="font-medium text-red-600">{formatCurrency(item.expenses)}</TableCell>
                        <TableCell>Despesas Operacionais</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
