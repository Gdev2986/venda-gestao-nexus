
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { ClientStatsCards } from "@/components/dashboard/client/ClientStatsCards";
import { ClientPeriodFilter } from "@/components/dashboard/client/ClientPeriodFilter";
import { ClientSalesTable } from "@/components/dashboard/client/ClientSalesTable";
import { ClientFeePlanDisplay } from "@/components/dashboard/client/ClientFeePlanDisplay";
import { ClientMachinesTable } from "@/components/dashboard/client/ClientMachinesTable";
import { BarChart } from "@/components/charts";
import { useClientBalance } from "@/hooks/use-client-balance";
import { useClientSales } from "@/hooks/use-client-sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, BarChart3, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

// Generate payment methods data for vertical bar chart with net values
const generatePaymentMethodsData = (salesStats: any) => {
  console.log('generatePaymentMethodsData - Input stats:', salesStats);
  
  const paymentMethods = salesStats.byPaymentMethod || {};
  
  return [
    {
      name: "PIX",
      gross: paymentMethods['PIX']?.gross || paymentMethods['Pix']?.gross || 0,
      net: paymentMethods['PIX']?.net || paymentMethods['Pix']?.net || 0,
      taxes: paymentMethods['PIX']?.taxes || paymentMethods['Pix']?.taxes || 0,
    },
    {
      name: "Débito", 
      gross: paymentMethods['DEBIT']?.gross || paymentMethods['Cartão de Débito']?.gross || 0,
      net: paymentMethods['DEBIT']?.net || paymentMethods['Cartão de Débito']?.net || 0,
      taxes: paymentMethods['DEBIT']?.taxes || paymentMethods['Cartão de Débito']?.taxes || 0,
    },
    {
      name: "Crédito",
      gross: paymentMethods['CREDIT']?.gross || paymentMethods['Cartão de Crédito']?.gross || 0,
      net: paymentMethods['CREDIT']?.net || paymentMethods['Cartão de Crédito']?.net || 0,
      taxes: paymentMethods['CREDIT']?.taxes || paymentMethods['Cartão de Crédito']?.taxes || 0,
    }
  ];
};

const ClientDashboard = () => {
  const { balance, isLoading: balanceLoading } = useClientBalance();
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();

  // Use the optimized client sales hook
  const { 
    sales, 
    stats, 
    totalCount,
    totalPages,
    currentPage,
    isLoading: salesLoading, 
    error,
    changePage,
    clientTaxBlock
  } = useClientSales(periodStart, periodEnd);

  console.log('ClientDashboard - Sales data:', sales);
  console.log('ClientDashboard - Stats:', stats);
  console.log('ClientDashboard - Tax block:', clientTaxBlock);

  // Generate payment methods data from real sales with net values
  const paymentMethodsData = generatePaymentMethodsData(stats);

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

      {/* Payment Methods Charts - Bruto vs Líquido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Faturamento Bruto por Método
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ) : (
              <BarChart
                data={paymentMethodsData}
                xAxisKey="name"
                dataKey="gross"
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

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Faturamento Líquido por Método
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            ) : (
              <BarChart
                data={paymentMethodsData}
                xAxisKey="name"
                dataKey="net"
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
      </div>

      {/* Cards de Estatísticas - Atualizados com taxas */}
      <ClientStatsCards
        currentBalance={balance || 0}
        periodGross={stats.totalGross}
        periodNet={stats.totalNet}
        totalTransactions={stats.totalTransactions}
        totalTaxes={stats.totalTaxes}
        isLoading={salesLoading || balanceLoading}
      />

      {/* Tabela de Vendas - usando a nova interface com valores líquidos */}
      <ClientSalesTable
        sales={sales}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        isLoading={salesLoading}
        onPageChange={changePage}
      />
    </div>
  );
};

export default ClientDashboard;
