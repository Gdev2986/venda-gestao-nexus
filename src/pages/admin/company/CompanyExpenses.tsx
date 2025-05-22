
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart } from "@/components/charts";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

// Mock data for demonstration
const mockExpenses = [
  { id: "1", date: "2023-06-01", category: "Aluguel", description: "Aluguel do escritório", value: 4000, status: "PAGO" },
  { id: "2", date: "2023-06-05", category: "Folha de Pagamento", description: "Salários do mês", value: 12000, status: "PAGO" },
  { id: "3", date: "2023-06-10", category: "Marketing", description: "Campanhas digitais", value: 3000, status: "PAGO" },
  { id: "4", date: "2023-06-15", category: "Sistemas", description: "Assinaturas de software", value: 2000, status: "PENDENTE" },
  { id: "5", date: "2023-06-20", category: "Outros", description: "Material de escritório", value: 1500, status: "PENDENTE" },
];

const categoryData = [
  { name: "Aluguel", value: 4000 },
  { name: "Folha", value: 12000 },
  { name: "Marketing", value: 3000 },
  { name: "Sistemas", value: 2000 },
  { name: "Outros", value: 1500 },
];

const CompanyExpenses = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Despesas da Empresa"
        description="Controle e análise de despesas operacionais"
      />

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nova Despesa</CardTitle>
          <CardDescription>Preencha os dados para adicionar uma nova despesa</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                placeholder="Selecione uma data"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                  <SelectItem value="folha">Folha de Pagamento</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sistemas">Sistemas</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" type="number" placeholder="0,00" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" placeholder="Descreva a despesa" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Despesa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Expenses Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Despesas</CardTitle>
          <CardDescription>Gastos por categoria</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart 
            data={categoryData}
            xAxisKey="name"
            dataKey={["value"]}
            colors={["#4ade80"]}
            height={300}
          />
        </CardContent>
      </Card>
      
      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Despesas</CardTitle>
          <CardDescription>Registro detalhado de todas as despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right">
                      R$ {expense.value.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        expense.status === "PAGO" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {expense.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyExpenses;
