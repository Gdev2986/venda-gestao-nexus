
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { DoughnutChart } from "@/components/charts";
import { 
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Save,
  Tag,
  DollarSign, 
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addDays, subDays, subMonths } from "date-fns";

// Tipos de dados
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  recurrence: "fixed" | "variable";
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const CompanyExpenses = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Diálogos e formulários
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  // Formulário de despesa
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    date: new Date(),
    category: "",
    recurrence: "variable" as "fixed" | "variable"
  });
  
  // Formulário de categoria
  const [categoryForm, setcategoryForm] = useState({
    name: "",
    color: "#4ade80"
  });
  
  // Ordenação
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Dados iniciais simulados
  useEffect(() => {
    setIsLoading(true);
    
    // Simular carregamento de categorias
    const initialCategories = [
      { id: "1", name: "Aluguel", color: "#f97316" },
      { id: "2", name: "Salários", color: "#60a5fa" },
      { id: "3", name: "Marketing", color: "#8B5CF6" },
      { id: "4", name: "Impostos", color: "#f43f5e" },
      { id: "5", name: "Serviços", color: "#4ade80" },
      { id: "6", name: "Outros", color: "#a78bfa" }
    ];
    
    // Simular carregamento de despesas
    const initialExpenses = [
      { 
        id: "1", 
        description: "Aluguel do escritório", 
        amount: 3500, 
        date: new Date(2023, 5, 5), 
        category: "1",
        recurrence: "fixed" as "fixed" | "variable"
      },
      { 
        id: "2", 
        description: "Salários equipe administrativa", 
        amount: 12000, 
        date: new Date(2023, 5, 10), 
        category: "2",
        recurrence: "fixed" as "fixed" | "variable"
      },
      { 
        id: "3", 
        description: "Campanha de marketing digital", 
        amount: 2500, 
        date: new Date(2023, 5, 15), 
        category: "3",
        recurrence: "variable" as "fixed" | "variable"
      },
      { 
        id: "4", 
        description: "Imposto municipal", 
        amount: 1800, 
        date: new Date(2023, 5, 20), 
        category: "4",
        recurrence: "fixed" as "fixed" | "variable"
      },
      { 
        id: "5", 
        description: "Serviço de limpeza", 
        amount: 800, 
        date: new Date(2023, 5, 25), 
        category: "5",
        recurrence: "fixed" as "fixed" | "variable"
      },
      { 
        id: "6", 
        description: "Material de escritório", 
        amount: 350, 
        date: new Date(2023, 5, 28), 
        category: "6",
        recurrence: "variable" as "fixed" | "variable"
      }
    ];
    
    setCategories(initialCategories);
    setExpenses(initialExpenses);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Preparar dados para o gráfico
  useEffect(() => {
    if (categories.length && expenses.length) {
      const expensesByCategory = categories.map(category => {
        const totalAmount = expenses
          .filter(expense => expense.category === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0);
          
        return {
          name: category.name,
          value: totalAmount,
          color: category.color
        };
      }).filter(item => item.value > 0);
      
      setChartData(expensesByCategory);
    }
  }, [expenses, categories]);
  
  // Funções de manipulação de dados
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === "amount") {
      return sortDirection === "asc" 
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortField === "description") {
      return sortDirection === "asc"
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    } else {
      return 0;
    }
  });
  
  // Filtrar despesas
  const filteredExpenses = sortedExpenses.filter(expense => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "fixed" && expense.recurrence === "fixed") || 
                      (activeTab === "variable" && expense.recurrence === "variable");
                      
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCategoryName(expense.category).toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });
  
  // Funções auxiliares
  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : "Sem categoria";
  };
  
  const getCategoryColor = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.color : "#cccccc";
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Manipulação de formulários
  const resetExpenseForm = () => {
    setExpenseForm({
      description: "",
      amount: "",
      date: new Date(),
      category: "",
      recurrence: "variable"
    });
    setCurrentExpense(null);
  };
  
  const resetCategoryForm = () => {
    setcategoryForm({
      name: "",
      color: "#4ade80"
    });
    setCurrentCategory(null);
  };
  
  const openExpenseDialog = (expense?: Expense) => {
    if (expense) {
      setCurrentExpense(expense);
      setExpenseForm({
        description: expense.description,
        amount: expense.amount.toString(),
        date: expense.date,
        category: expense.category,
        recurrence: expense.recurrence
      });
    } else {
      resetExpenseForm();
    }
    setShowExpenseDialog(true);
  };
  
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setcategoryForm({
        name: category.name,
        color: category.color
      });
    } else {
      resetCategoryForm();
    }
    setShowCategoryDialog(true);
  };
  
  const handleSaveExpense = () => {
    // Validação básica
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.category) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(expenseForm.amount.replace(',', '.'));
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor da despesa deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }
    
    if (currentExpense) {
      // Atualizar despesa existente
      const updatedExpenses = expenses.map(exp => 
        exp.id === currentExpense.id ? {
          ...exp,
          description: expenseForm.description,
          amount: amount,
          date: expenseForm.date,
          category: expenseForm.category,
          recurrence: expenseForm.recurrence
        } : exp
      );
      
      setExpenses(updatedExpenses);
      toast({
        title: "Despesa atualizada",
        description: "A despesa foi atualizada com sucesso"
      });
    } else {
      // Adicionar nova despesa
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: expenseForm.description,
        amount: amount,
        date: expenseForm.date,
        category: expenseForm.category,
        recurrence: expenseForm.recurrence
      };
      
      setExpenses([...expenses, newExpense]);
      toast({
        title: "Despesa adicionada",
        description: "A nova despesa foi adicionada com sucesso"
      });
    }
    
    setShowExpenseDialog(false);
    resetExpenseForm();
  };
  
  const handleSaveCategory = () => {
    // Validação básica
    if (!categoryForm.name) {
      toast({
        title: "Erro ao salvar",
        description: "O nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (currentCategory) {
      // Atualizar categoria existente
      const updatedCategories = categories.map(cat => 
        cat.id === currentCategory.id ? {
          ...cat,
          name: categoryForm.name,
          color: categoryForm.color
        } : cat
      );
      
      setCategories(updatedCategories);
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso"
      });
    } else {
      // Adicionar nova categoria
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryForm.name,
        color: categoryForm.color
      };
      
      setCategories([...categories, newCategory]);
      toast({
        title: "Categoria adicionada",
        description: "A nova categoria foi adicionada com sucesso"
      });
    }
    
    setShowCategoryDialog(false);
    resetCategoryForm();
  };
  
  const handleDeleteExpense = (expense: Expense) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== expense.id);
    setExpenses(updatedExpenses);
    toast({
      title: "Despesa removida",
      description: "A despesa foi removida com sucesso"
    });
  };
  
  const handleDeleteCategory = (category: Category) => {
    // Verificar se há despesas usando esta categoria
    const hasExpensesWithCategory = expenses.some(exp => exp.category === category.id);
    
    if (hasExpensesWithCategory) {
      toast({
        title: "Não é possível remover",
        description: "Existem despesas associadas a esta categoria",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCategories = categories.filter(cat => cat.id !== category.id);
    setCategories(updatedCategories);
    toast({
      title: "Categoria removida",
      description: "A categoria foi removida com sucesso"
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs e Controles de filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="fixed">Fixas</TabsTrigger>
                  <TabsTrigger value="variable">Variáveis</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar despesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => openExpenseDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Despesa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentExpense ? "Editar Despesa" : "Nova Despesa"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        placeholder="Ex: Aluguel do escritório"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Valor (R$)</Label>
                      <Input
                        id="amount"
                        placeholder="Ex: 1500,00"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <DatePicker 
                        selected={expenseForm.date} 
                        onSelect={(date) => date && setExpenseForm(prev => ({ ...prev, date }))}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select 
                        value={expenseForm.category} 
                        onValueChange={(value) => setExpenseForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <div
                                  className="h-3 w-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Recorrência</Label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            className="h-4 w-4 text-primary"
                            checked={expenseForm.recurrence === "fixed"}
                            onChange={() => setExpenseForm(prev => ({ ...prev, recurrence: "fixed" }))}
                          />
                          <span>Fixa</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            className="h-4 w-4 text-primary"
                            checked={expenseForm.recurrence === "variable"}
                            onChange={() => setExpenseForm(prev => ({ ...prev, recurrence: "variable" }))}
                          />
                          <span>Variável</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleSaveExpense}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Categorias
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentCategory ? "Editar Categoria" : "Gerenciar Categorias"}
                    </DialogTitle>
                  </DialogHeader>
                  {currentCategory ? (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Nome</Label>
                        <Input
                          id="category-name"
                          placeholder="Ex: Aluguel"
                          value={categoryForm.name}
                          onChange={(e) => setcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Cor</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            className="h-8 w-8 border rounded"
                            value={categoryForm.color}
                            onChange={(e) => setcategoryForm(prev => ({ ...prev, color: e.target.value }))}
                          />
                          <Input
                            id="category-color"
                            value={categoryForm.color}
                            onChange={(e) => setcategoryForm(prev => ({ ...prev, color: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCurrentCategory(null)}>
                          Voltar
                        </Button>
                        <Button onClick={handleSaveCategory}>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <>
                      <div className="py-4">
                        <Button 
                          onClick={() => openCategoryDialog()}
                          className="mb-4 w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nova Categoria
                        </Button>
                        
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-1">
                            {categories.map((category) => (
                              <div 
                                key={category.id}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                              >
                                <div className="flex items-center">
                                  <div
                                    className="h-4 w-4 rounded-full mr-2"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  <span>{category.name}</span>
                                </div>
                                <div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openCategoryDialog(category)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Fechar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resumo e gráfico das despesas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de distribuição */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Total: {formatCurrency(totalExpenses)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-[300px]">
                <DoughnutChart 
                  data={chartData}
                  dataKey="value"
                />
                <div className="mt-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.value)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({Math.round((item.value / totalExpenses) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados para exibir</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Listagem de despesas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Despesas {activeTab === "fixed" ? "Fixas" : activeTab === "variable" ? "Variáveis" : ""}</CardTitle>
            <CardDescription>
              {filteredExpenses.length} despesas encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th 
                        className="py-3 px-4 text-left font-medium cursor-pointer"
                        onClick={() => handleSort("description")}
                      >
                        <div className="flex items-center">
                          Descrição
                          {sortField === "description" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Categoria</th>
                      <th 
                        className="py-3 px-4 text-right font-medium cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center justify-end">
                          Valor
                          {sortField === "amount" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="py-3 px-4 text-center font-medium cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center justify-center">
                          Data
                          {sortField === "date" && (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{expense.description}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: getCategoryColor(expense.category) }}
                            />
                            {getCategoryName(expense.category)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <Badge variant={expense.recurrence === "fixed" ? "secondary" : "outline"} className="mr-2">
                              {expense.recurrence === "fixed" ? "Fixa" : "Variável"}
                            </Badge>
                            {format(expense.date, 'dd/MM/yyyy')}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openExpenseDialog(expense)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Linha de total */}
                    <tr className="bg-muted/20 font-medium">
                      <td className="py-3 px-4" colSpan={2}>
                        Total
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(totalExpenses)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Nenhuma despesa encontrada</p>
                  <Button 
                    onClick={() => openExpenseDialog()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Despesa
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyExpenses;
