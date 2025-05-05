
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  stats: {
    totalSales: number;
    netSales: number;
    totalClients: number;
    totalMachines: number;
    pendingPayments: number;
    pendingCommissions: number;
    currentBalance: number;
    salesGrowth: number;
    isGrowthPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCards = ({ stats, isLoading = false }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="flex items-center">
                  {stats.isGrowthPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {stats.salesGrowth}% em relação ao mês anterior
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Net Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Vendas Líquidas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.netSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Margem de {((stats.netSales / stats.totalSales) * 100).toFixed(1)}%
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Clients Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalMachines} máquinas instaladas
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Caixa Atual</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.currentBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingPayments} pagamentos pendentes
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
