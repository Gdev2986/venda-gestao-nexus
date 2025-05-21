import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, PieChart } from "@/components/charts";
import { MoreHorizontal, Plus, Filter, Download, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    description: "Aluguel do Escritório",
    category: "Aluguel",
    amount: 3500,
    date: "2023-06-10",
    recurring: true,
    frequency: "Mensal",
  },
  {
    id: "2",
    description: "Folha de Pagamento",
    category: "Pessoal",
    amount: 12000,
    date: "2023-06-05",
    recurring: true,
    frequency: "Mensal",
  },
  {
    id: "3",
    description: "Material de Escritório",
    category: "Suprimentos",
    amount: 450,
    date: "2023-06-15",
    recurring: false,
    frequency: null,
  },
  {
    id: "4",
    description: "Contas de Serviços (Água, Luz, Internet)",
    category: "Utilidades",
    amount: 850,
    date: "2023-06-20",
    recurring: true,
    frequency: "Mensal",
  },
  {
    id: "5",
    description: "Manutenção de Equipamentos",
    category: "Manutenção",
    amount: 1200,
    date: "2023-06-25",
    recurring: false,
    frequency: null,
  },
];

// Expense categories for dropdown
const expenseCategories = [
  "Aluguel",
  "Pessoal",
  "Suprimentos",
  "Utilidades",
  "Manutenção",
  "Marketing",
  "Viagem",
  "Impostos",
  "Outros",
];

// Frequency options
const frequencyOptions = [
  "Diário",
  "Semanal",
  "Mensal",
  "Trimestral",
  "Semestral",
  "Anual",
];

// Chart data calculation
const getChartData = (expenses) => {
  const categoryMap = {};
  
  // Group by category
  expenses.forEach((expense) => {
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = 0;
    }
    categoryMap[expense.category] += expense.amount;
  });
  
  // Convert to array format for charts with typed values
  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Number(value),
  }));
};

const ExpenseForm = ({ onClose, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      description: "",
      category: "",
      amount: "",
      date: new Date(),
      recurring: false,
      frequency: "",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Data</Label>
          <DatePicker
            selected={
              formData.date instanceof Date
                ? formData.date
                : new Date(formData.date)
            }
            onSelect={handleDateChange}
            placeholder="Selecione uma data"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="recurring"
            name="recurring"
            checked={formData.recurring}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="recurring" className="text-sm font-normal">
            Despesa Recorrente
          </Label>
        </div>

        {formData.recurring && (
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Select
              name="frequency"
              value={formData.frequency}
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
};

const ExpenseItem = ({ expense }) => {
  const formattedDate = new Date(expense.date).toLocaleDateString("pt-BR");

  return (
    <TableRow>
      <TableCell className="font-medium">{expense.description}</TableCell>
      <TableCell>
        <Badge variant="outline">{expense.category}</Badge>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        {expense.recurring ? (
          <Badge variant="secondary">{expense.frequency}</Badge>
        ) : (
          <Badge variant="outline">Única</Badge>
        )}
      </TableCell>
      <TableCell className="text-right font-mono">
        R$ {expense.amount.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const CompanyExpenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [filter, setFilter] = useState("all"); // all, recurring, one-time
  const [expenses, setExpenses] = useState(mockExpenses);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Filter expenses based on selected filter
  const filteredExpenses = expenses.filter((expense) => {
    if (filter === "all") return true;
    if (filter === "recurring") return expense.recurring;
    if (filter === "one-time") return !expense.recurring;
    return true;
  });

  // Calculate totals
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate chart data with proper typing
  const chartData = getChartData(filteredExpenses);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Despesas da Empresa</CardTitle>
              <CardDescription>
                Gerenciamento de despesas fixas e variáveis
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Despesa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes da despesa abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <ExpenseForm onClose={() => setShowAddExpense(false)} />
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    Todas as Despesas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("recurring")}>
                    Apenas Despesas Recorrentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("one-time")}>
                    Apenas Despesas Únicas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Despesas</CardTitle>
                <CardDescription>
                  {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  R$ {totalAmount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {filteredExpenses.length} despesas no total
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Despesas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[200px]">
                {chartData.length > 0 ? (
                  <PieChart
                    data={chartData}
                    nameKey="name"
                    dataKey="value"
                    colors={[
                      "#8b5cf6",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                      "#ec4899",
                    ]}
                    height={180}
                  />
                ) : (
                  <div className="text-muted-foreground">
                    Sem dados para exibir
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}

                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma despesa encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredExpenses.length > 0 && (
            <div className="flex justify-end mt-4">
              <div className="bg-muted px-4 py-2 rounded-md">
                <span className="mr-2 font-medium">Total:</span>
                <span className="font-bold">
                  R$ {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyExpenses;
