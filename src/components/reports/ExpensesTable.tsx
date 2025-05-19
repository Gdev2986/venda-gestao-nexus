
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatCurrency } from "@/lib/utils";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onDeleteExpense?: (id: string) => void;
  onEditExpense?: (expense: Expense) => void;
}

const ExpensesTable = ({ 
  expenses, 
  isLoading, 
  onDeleteExpense, 
  onEditExpense 
}: ExpensesTableProps) => {
  const [page, setPage] = useState(1);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Pessoal" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Administrativo" }
  ]);
  
  const pageSize = 10;
  const totalPages = Math.ceil(expenses.length / pageSize);
  const paginatedExpenses = expenses.slice((page - 1) * pageSize, page * pageSize);
  
  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { 
        id: Date.now().toString(), 
        name: newCategory.trim() 
      }]);
      setNewCategory("");
    }
  };
  
  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    // In a real application, you would also delete all expenses with this category
  };
  
  if (isLoading) {
    return <div className="py-4 text-center">Carregando despesas...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Despesas</h3>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => setIsCategoryDialogOpen(true)}>
            Gerenciar Categorias
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border bg-background dark:bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-mono text-xs">{expense.id}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="hidden sm:table-cell">{expense.date}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {onEditExpense && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditExpense(expense)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteExpense && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => onDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nenhuma despesa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="py-2 px-2 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  Página {page} de {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      {/* Categories Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="new-category">Nova Categoria</Label>
                <Input
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nome da categoria"
                />
              </div>
              <Button onClick={addCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            <div className="border rounded-md divide-y">
              {categories.map((category) => (
                <div key={category.id} className="flex justify-between items-center p-3">
                  <span>{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="p-3 text-center text-muted-foreground">
                  Nenhuma categoria cadastrada.
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsCategoryDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesTable;
