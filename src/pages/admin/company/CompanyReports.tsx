import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, BarChart } from "@/components/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockData = {
  cashFlow: [
    { name: "Jan", entrada: 12000, saida: 8000, saldo: 4000 },
    { name: "Fev", entrada: 15000, saida: 10000, saldo: 5000 },
    { name: "Mar", entrada: 18000, saida: 12000, saldo: 6000 },
    { name: "Abr", entrada: 16000, saida: 14000, saldo: 2000 },
    { name: "Mai", entrada: 20000, saida: 15000, saldo: 5000 },
    { name: "Jun", entrada: 22000, saida: 16000, saldo: 6000 },
  ],
  clientBalance: [
    { name: "Jan", pendente: 5000, recebido: 15000 },
    { name: "Fev", pendente: 6000, recebido: 18000 },
    { name: "Mar", pendente: 4500, recebido: 20000 },
    { name: "Abr", pendente: 7000, recebido: 19000 },
    { name: "Mai", pendente: 6500, recebido: 22000 },
    { name: "Jun", pendente: 8000, recebido: 24000 },
  ],
  commission: [
    { name: "Jan", comissao: 1200 },
    { name: "Fev", comissao: 1500 },
    { name: "Mar", comissao: 1800 },
    { name: "Abr", comissao: 1600 },
    { name: "Mai", comissao: 2000 },
    { name: "Jun", comissao: 2200 },
  ],
  expenses: [
    { category: "Aluguel", valor: 4000 },
    { category: "Folha de Pagamento", valor: 12000 },
    { category: "Marketing", valor: 3000 },
    { category: "Sistemas", valor: 2000 },
    { category: "Outros", valor: 1500 },
  ],
  detailedData: [
    {
      id: "1",
      data: "01/06/2023",
      descricao: "Pagamento Cliente A",
      tipo: "Entrada",
      valor: 5000,
    },
    {
      id: "2",
      data: "03/06/2023",
      descricao: "Aluguel",
      tipo: "Saída",
      valor: -4000,
    },
    {
      id: "3",
      data: "05/06/2023",
      descricao: "Pagamento Cliente B",
      tipo: "Entrada",
      valor: 3500,
    },
    {
      id: "4",
      data: "10/06/2023",
      descricao: "Folha de Pagamento",
      tipo: "Saída",
      valor: -12000,
    },
    {
      id: "5",
      data: "15/06/2023",
      descricao: "Comissão Parceiro X",
      tipo: "Saída",
      valor: -1200,
    },
  ],
};

const CompanyReports = () => {
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: subMonths(new Date(), 6),
    end: new Date(),
  });

  const handleStartDateChange = (date: Date) => {
    setDateRange((prev) => ({ ...prev, start: date }));
  };

  const handleEndDateChange = (date: Date) => {
    setDateRange((prev) => ({ ...prev, end: date }));
  };

  const handlePredefinedRange = (months: number) => {
    setDateRange({
      start: subMonths(new Date(), months),
      end: new Date(),
    });
  };

  // Calculate summary data
  const currentBalance = 45000; // Mock current balance
  const provisionalBalance = 12000; // Mock provisional balance
  const pendingBalance = 22000; // Mock client pending balance
  const totalCommission = 10200; // Mock total commission

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios da Empresa"
        description="Análise detalhada do desempenho financeiro da empresa"
      />
      
      {/* Date Filter Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtro por Período</CardTitle>
          <CardDescription>
            Selecione o intervalo de datas para os relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">De:</span>
                <DatePicker
                  selected={dateRange.start}
                  onSelect={handleStartDateChange}
                  placeholder="Data inicial"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Até:</span>
                <DatePicker
                  selected={dateRange.end}
                  onSelect={handleEndDateChange}
                  placeholder="Data final"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedRange(1)}
            >
              Último mês
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedRange(3)}
            >
              Últimos 3 meses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedRange(6)}
            >
              Últimos 6 meses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedRange(12)}
            >
              Último ano
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo de Caixa</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">
              R$ {currentBalance.toLocaleString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Disponível atualmente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Provisão de Caixa</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              R$ {provisionalBalance.toLocaleString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Valores agendados futuros
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo de Clientes</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              R$ {pendingBalance.toLocaleString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Pendente de recebimento
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comissão do Escritório</CardDescription>
            <CardTitle className="text-2xl text-purple-600">
              R$ {totalCommission.toLocaleString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Comissão total acumulada
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
          <CardDescription>
            Entradas, saídas e saldo do período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={mockData.cashFlow}
            xAxisKey="name"
            dataKey={["entrada", "saida", "saldo"]}
            colors={["#10b981", "#ef4444", "#6366f1"]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Detailed Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Detalhadas</CardTitle>
          <CardDescription>
            Registro detalhado de entradas e saídas no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>01/06/2023</TableCell>
                  <TableCell>Pagamento Cliente A</TableCell>
                  <TableCell>
                    <span className="text-emerald-600">Entrada</span>
                  </TableCell>
                  <TableCell className="text-right text-emerald-600">
                    R$ 5.000,00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>03/06/2023</TableCell>
                  <TableCell>Aluguel</TableCell>
                  <TableCell>
                    <span className="text-destructive">Saída</span>
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    R$ 4.000,00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>05/06/2023</TableCell>
                  <TableCell>Pagamento Cliente B</TableCell>
                  <TableCell>
                    <span className="text-emerald-600">Entrada</span>
                  </TableCell>
                  <TableCell className="text-right text-emerald-600">
                    R$ 3.500,00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10/06/2023</TableCell>
                  <TableCell>Folha de Pagamento</TableCell>
                  <TableCell>
                    <span className="text-destructive">Saída</span>
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    R$ 12.000,00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15/06/2023</TableCell>
                  <TableCell>Comissão Parceiro X</TableCell>
                  <TableCell>
                    <span className="text-destructive">Saída</span>
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    R$ 1.200,00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyReports;
