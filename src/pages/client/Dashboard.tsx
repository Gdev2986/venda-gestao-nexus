
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { ClientStatsCards } from "@/components/dashboard/client/ClientStatsCards";
import { ClientPeriodFilter } from "@/components/dashboard/client/ClientPeriodFilter";
import { ClientSalesTable } from "@/components/dashboard/client/ClientSalesTable";
import { ClientFeePlanDisplay } from "@/components/dashboard/client/ClientFeePlanDisplay";
import { ClientMachinesTable } from "@/components/dashboard/client/ClientMachinesTable";
import { BarChart } from "@/components/charts";
import { useClientBalance } from "@/hooks/use-client-balance";
import { useClientSales } from "@/hooks/use-client-sales";
import { useAuth } from "@/hooks/use-auth";
import { PaymentMethod } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

// Generate payment methods data for vertical bar chart
const generatePaymentMethodsData = (sales: any[]) => {
  console.log('generatePaymentMethodsData - Input sales:', sales);
  
  const methodCounts = sales.reduce((acc: Record<string, number>, sale: any) => {
    const method = sale.payment_method;
    const amount = Number(sale.gross_amount) || 0;
    acc[method] = (acc[method] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  console.log('Method counts:', methodCounts);

  const total = Object.values(methodCounts).reduce((sum: number, amount: number) => {
    return sum + amount;
  }, 0);

  const pixAmount = Number(methodCounts[PaymentMethod.PIX]) || 0;
  const debitAmount = Number(methodCounts[PaymentMethod.DEBIT]) || 0;
  const creditAmount = Number(methodCounts[PaymentMethod.CREDIT]) || 0;

  return [
    {
      name: "PIX",
      value: pixAmount,
      percent: total > 0 ? Math.round((pixAmount / total) * 100) : 0
    },
    {
      name: "Débito", 
      value: debitAmount,
      percent: total > 0 ? Math.round((debitAmount / total) * 100) : 0
    },
    {
      name: "Crédito",
      value: creditAmount,
      percent: total > 0 ? Math.round((creditAmount / total) * 100) : 0
    }
  ];
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useClientBalance();
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();

  // Use the new hook for real sales data
  const { sales, stats, isLoading: salesLoading, error } = useClientSales(periodStart, periodEnd);

  console.log('ClientDashboard - Sales data:', sales);
  console.log('ClientDashboard - Stats:', stats);
  console.log('ClientDashboard - Error:', error);
  console.log('ClientDashboard - Period:', { periodStart, periodEnd });

  // Generate payment methods data from real sales
  const paymentMethodsData = generatePaymentMethodsData(sales);

  const handlePeriodChange = (startDate: Date, endDate: Date) => {
    console.log('Period changed:', { startDate, endDate });
    setPeriodStart(startDate);
    setPeriodEnd(endDate);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle"
      />

      {/* Balance Card - always visible, no date filter */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Saldo Disponível</CardTitle>
          <Wallet className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">
                {balanceLoading ? (
                  <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
                ) : (
                  new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(balance || 0)
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Valor disponível para saque
              </p>
            </div>
            <Button asChild>
              <Link to={PATHS.CLIENT.PAYMENTS}>
                <DollarSign className="h-4 w-4 mr-2" />
                Solicitar Pagamento
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid com Plano de Taxas e Máquinas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientFeePlanDisplay />
        <ClientMachinesTable />
      </div>

      {/* Filtro de Período */}
      <ClientPeriodFilter onPeriodChange={handlePeriodChange} />

      {error && (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <p className="text-red-600">Erro ao carregar dados: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Bar Chart */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Vendas por Método de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
          ) : (
            <BarChart
              data={paymentMethodsData}
              xAxisKey="name"
              dataKey="value"
              height={300}
              colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]}
              formatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <ClientStatsCards
        currentBalance={balance || 0}
        periodGross={stats.totalGross}
        periodNet={stats.totalNet}
        totalTransactions={stats.totalTransactions}
        isLoading={salesLoading || balanceLoading}
      />

      {/* Tabela de Vendas */}
      <ClientSalesTable
        sales={sales}
        isLoading={salesLoading}
      />
    </div>
  );
};

export default ClientDashboard;
