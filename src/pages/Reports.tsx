
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Upload, FileText, Plus } from "lucide-react";

// Mock data for demonstration
const salesData = [
  { month: 'Jan', amount: 4000 },
  { month: 'Feb', amount: 3000 },
  { month: 'Mar', amount: 2000 },
  { month: 'Apr', amount: 2780 },
  { month: 'May', amount: 1890 },
  { month: 'Jun', amount: 2390 },
  { month: 'Jul', amount: 3490 },
];

const expensesData = [
  { name: 'Aluguel', value: 2500 },
  { name: 'Salários', value: 5000 },
  { name: 'Marketing', value: 1500 },
  { name: 'Software', value: 1000 },
  { name: 'Outros', value: 800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  // Mock expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Aluguel do escritório', amount: 2500, date: '2023-05-01', category: 'Aluguel' },
    { id: '2', description: 'Salários equipe', amount: 5000, date: '2023-05-05', category: 'Salários' },
    { id: '3', description: 'Campanha marketing', amount: 1500, date: '2023-05-10', category: 'Marketing' },
    { id: '4', description: 'Assinatura software', amount: 1000, date: '2023-05-15', category: 'Software' },
  ]);
  
  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    date: '',
    category: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFiles = (files: File[]) => {
    const csvFiles = files.filter(file => file.name.endsWith('.csv'));
    if (csvFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos CSV.",
      });
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...csvFiles]);
  };
  
  const handleUploadFiles = () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione ao menos um arquivo CSV para enviar.",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFiles([]);
      setShowUploadDialog(false);
      
      toast({
        title: "Arquivos processados",
        description: `${uploadedFiles.length} arquivo(s) processados com sucesso.`,
      });
    }, 2000);
  };

  const handleAddExpense = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setExpenses([...expenses, { ...newExpense, id }]);
    setShowAddExpenseDialog(false);
    setNewExpense({
      description: '',
      amount: 0,
      date: '',
      category: ''
    });
    
    toast({
      title: "Despesa adicionada",
      description: "A despesa foi adicionada com sucesso.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
            <Button onClick={() => setShowAddExpenseDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 max-w-md mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas Mensais</CardTitle>
                  <CardDescription>Evolução das vendas nos últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#0066FF" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                  <CardDescription>Categorização por tipo de despesa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expensesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>Visão consolidada de receitas e despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary-50 rounded-md">
                    <p className="text-sm font-medium text-primary">Total Receitas</p>
                    <p className="text-2xl font-bold">R$ 17.550,00</p>
                    <p className="text-xs text-green-600">+5.2% mês anterior</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-500">Total Despesas</p>
                    <p className="text-2xl font-bold">R$ 10.800,00</p>
                    <p className="text-xs text-red-600">+2.1% mês anterior</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-600">Lucro Líquido</p>
                    <p className="text-2xl font-bold">R$ 6.750,00</p>
                    <p className="text-xs text-green-600">+9.3% mês anterior</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-600">Margem</p>
                    <p className="text-2xl font-bold">38.5%</p>
                    <p className="text-xs text-blue-600">+1.2% mês anterior</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Vendas</CardTitle>
                <CardDescription>Detalhamento completo de vendas por período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#0066FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Detalhamento por Cliente</h3>
                    <Button variant="outline" size="sm">Exportar</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Total Vendas</TableHead>
                        <TableHead>Tickets</TableHead>
                        <TableHead>Média Ticket</TableHead>
                        <TableHead>% Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Empresa ABC</TableCell>
                        <TableCell>R$ 4,250.00</TableCell>
                        <TableCell>28</TableCell>
                        <TableCell>R$ 151.79</TableCell>
                        <TableCell>24.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Empresa XYZ</TableCell>
                        <TableCell>R$ 3,850.00</TableCell>
                        <TableCell>22</TableCell>
                        <TableCell>R$ 175.00</TableCell>
                        <TableCell>21.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Empresa 123</TableCell>
                        <TableCell>R$ 2,980.00</TableCell>
                        <TableCell>19</TableCell>
                        <TableCell>R$ 156.84</TableCell>
                        <TableCell>17.0%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registro de Despesas</CardTitle>
                  <CardDescription>Gerenciamento completo de despesas operacionais</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Nenhuma despesa registrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>R$ {expense.amount.toFixed(2)}</TableCell>
                          <TableCell>{new Date(expense.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Editar</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CSV Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Importar Relatório CSV</DialogTitle>
            </DialogHeader>
            <div 
              className={cn(
                "border-2 border-dashed rounded-md p-8 text-center",
                dragActive ? "border-primary bg-primary-50" : "border-border",
                "transition-all duration-200 ease-in-out"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">
                  Arraste arquivos CSV ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Suporta apenas arquivos .csv
                </p>
                <Input 
                  type="file" 
                  accept=".csv"
                  className="hidden" 
                  id="fileUpload"
                  multiple
                  onChange={handleFileChange}
                />
                <Label htmlFor="fileUpload" className="cursor-pointer">
                  <Button variant="outline" type="button">
                    Selecionar Arquivos
                  </Button>
                </Label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Arquivos selecionados:</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setUploadedFiles(files => files.filter((_, i) => i !== index));
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setUploadedFiles([]);
                  setShowUploadDialog(false);
                }}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUploadFiles}
                disabled={uploadedFiles.length === 0 || isUploading}
              >
                {isUploading ? "Processando..." : "Processar Arquivos"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Despesa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input 
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input 
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input 
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddExpenseDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddExpense}>
                Adicionar Despesa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

// Utility function for class merging
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default Reports;
