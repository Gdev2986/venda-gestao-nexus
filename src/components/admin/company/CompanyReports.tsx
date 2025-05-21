import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { BarChart, LineChart } from "@/components/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const [activeTab, setActiveTab] = useState("overview");

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
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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

      {/* Tabs for Different Reports */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="clients">Saldos de Clientes</TabsTrigger>
          <TabsTrigger value="commission">Comissões</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
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
                labels={["Entradas", "Saídas", "Saldo"]}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pendências e Recebimentos</CardTitle>
              <CardDescription>
                Valores pendentes vs. recebidos no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={mockData.clientBalance}
                xAxisKey="name"
                dataKey={["pendente", "recebido"]}
                colors={["#f59e0b", "#10b981"]}
                labels={["Pendente", "Recebido"]}
                height={300}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comissões</CardTitle>
                <CardDescription>
                  Comissões geradas no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={mockData.commission}
                  xAxisKey="name"
                  dataKey={["comissao"]}
                  colors={["#8b5cf6"]}
                  labels={["Comissão"]}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>
                  Proporção por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {/* Placeholder for Pie Chart - use specific chart library as needed */}
                <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                  Gráfico de distribuição de despesas aqui
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Tab Content */}
        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento do Fluxo de Caixa</CardTitle>
              <CardDescription>
                Análise detalhada de entradas e saídas
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
                    {mockData.detailedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.data}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>
                          <span
                            className={
                              item.tipo === "Entrada"
                                ? "text-emerald-600"
                                : "text-destructive"
                            }
                          >
                            {item.tipo}
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            item.valor > 0
                              ? "text-emerald-600"
                              : "text-destructive"
                          }`}
                        >
                          R$ {Math.abs(item.valor).toLocaleString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <LineChart
                  data={mockData.cashFlow}
                  xAxisKey="name"
                  dataKey={["entrada", "saida", "saldo"]}
                  colors={["#10b981", "#ef4444", "#6366f1"]}
                  labels={["Entradas", "Saídas", "Saldo"]}
                  height={350}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline">Exportar para CSV</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Balance Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Saldos de Clientes</CardTitle>
              <CardDescription>Análise por período</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Client balance content goes here */}
              <div className="mb-6">
                <BarChart
                  data={mockData.clientBalance}
                  xAxisKey="name"
                  dataKey={["pendente", "recebido"]}
                  colors={["#f59e0b", "#10b981"]}
                  labels={["Pendente", "Recebido"]}
                  height={350}
                />
              </div>

              {/* Detailed client data table would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Tab */}
        <TabsContent value="commission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Comissões</CardTitle>
              <CardDescription>Por período e parceiro</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Commission content goes here */}
              <div className="mb-6">
                <BarChart
                  data={mockData.commission}
                  xAxisKey="name"
                  dataKey={["comissao"]}
                  colors={["#8b5cf6"]}
                  labels={["Comissão"]}
                  height={350}
                />
              </div>

              {/* Detailed commission data table would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyReports;
