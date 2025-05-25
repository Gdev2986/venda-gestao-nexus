
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import { Plus, Filter, Edit, Trash2 } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  recurrence: 'única' | 'semanal' | 'mensal' | 'anual';
  start_date: string;
  end_date?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

const AdminExpenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Operacional', description: 'Despesas operacionais' },
    { id: '2', name: 'Marketing', description: 'Despesas de marketing' },
    { id: '3', name: 'Tecnologia', description: 'Despesas de TI' },
  ]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    recurrence: 'única',
    start_date: '',
    end_date: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const itemsPerPage = 25;

  // Mock data
  useEffect(() => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        description: 'Aluguel do escritório',
        amount: 3500,
        category: 'Operacional',
        date: '2024-01-15',
        recurrence: 'mensal',
        start_date: '2024-01-15',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        description: 'Campanha Google Ads',
        amount: 1200,
        category: 'Marketing',
        date: '2024-01-10',
        recurrence: 'única',
        start_date: '2024-01-10',
        created_at: '2024-01-10T15:30:00Z'
      }
    ];
    setExpenses(mockExpenses);
    setFilteredExpenses(mockExpenses);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...expenses];
    
    if (dateFilter) {
      filtered = filtered.filter(expense => expense.date.includes(dateFilter));
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }
    
    if (minAmount) {
      filtered = filtered.filter(expense => expense.amount >= parseFloat(minAmount));
    }
    
    if (maxAmount) {
      filtered = filtered.filter(expense => expense.amount <= parseFloat(maxAmount));
    }
    
    setFilteredExpenses(filtered);
    setPage(1);
  }, [expenses, dateFilter, categoryFilter, minAmount, maxAmount]);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveExpense = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.start_date,
      recurrence: formData.recurrence as any,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      created_at: editingExpense?.created_at || new Date().toISOString()
    };

    if (editingExpense) {
      setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? newExpense : exp));
      toast({
        title: "Despesa atualizada",
        description: "A despesa foi atualizada com sucesso"
      });
    } else {
      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: "Despesa cadastrada",
        description: "A despesa foi cadastrada com sucesso"
      });
    }

    setFormData({
      description: '',
      amount: '',
      category: '',
      recurrence: 'única',
      start_date: '',
      end_date: ''
    });
    setEditingExpense(null);
    setShowExpenseDialog(false);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? newCategory : cat));
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso"
      });
    } else {
      setCategories(prev => [newCategory, ...prev]);
      toast({
        title: "Categoria criada",
        description: "A categoria foi criada com sucesso"
      });
    }

    setCategoryForm({ name: '', description: '' });
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast({
      title: "Despesa excluída",
      description: "A despesa foi excluída com sucesso"
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso"
    });
  };

  const clearFilters = () => {
    setDateFilter('');
    setCategoryFilter('');
    setMinAmount('');
    setMaxAmount('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Despesas"
        description="Gerencie as despesas da empresa"
        action={
          <div className="flex gap-2">
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Nome *</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryDescription">Descrição</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da categoria"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveCategory}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da despesa"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Valor *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="recurrence">Recorrência</Label>
                    <Select value={formData.recurrence} onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="única">Única</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="start_date">Data de Início *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  
                  {formData.recurrence !== 'única' && (
                    <div>
                      <Label htmlFor="end_date">Data de Término</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveExpense}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Totalizador */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-sm text-muted-foreground">
            Total de {filteredExpenses.length} despesa(s) filtrada(s)
          </p>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFilter">Data</Label>
              <Input
                id="dateFilter"
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="categoryFilter">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="minAmount">Valor Mínimo</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="maxAmount">Valor Máximo</Label>
              <Input
                id="maxAmount"
                type="number"
                step="0.01"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryForm({ name: category.name, description: category.description || '' });
                      setShowCategoryDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Recorrência</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={expense.recurrence === 'única' ? 'default' : 'secondary'}>
                      {expense.recurrence}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExpense(expense);
                          setFormData({
                            description: expense.description,
                            amount: expense.amount.toString(),
                            category: expense.category,
                            recurrence: expense.recurrence,
                            start_date: expense.start_date,
                            end_date: expense.end_date || ''
                          });
                          setShowExpenseDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem className="flex items-center">
                    <span>Página {page} de {totalPages}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExpenses;
