
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, ShoppingCart, AlertCircle, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  stats: {
    totalSales: number;
    grossSales: number;
    netSales: number;
    pendingRequests: number;
    expenses: number;
    totalCommissions: number;
    currentBalance: number;
    salesGrowth: number;
    isGrowthPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCards = ({ stats, isLoading = false }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Sales Card */}
      <Card className="col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded mb-2" />
          ) : (
            <>
              <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
              <div className="flex items-center pt-1">
                {stats.isGrowthPositive ? (
                  <ArrowUpIcon className="h-3 w-3 text-success mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-danger mr-1" />
                )}
                <p className={`text-xs ${stats.isGrowthPositive ? 'text-success' : 'text-danger'}`}>
                  {stats.salesGrowth}% em relação ao mês anterior
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Gross Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valor Bruto</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.grossSales)}</div>
          )}
          <p className="text-xs text-muted-foreground pt-1">Valor total bruto</p>
        </CardContent>
      </Card>

      {/* Net Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valor Líquido</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.netSales)}</div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            Margem de {((stats.netSales / stats.grossSales) * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Pending Requests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl font-bold">{stats.pendingRequests}</div>
          )}
          <p className="text-xs text-muted-foreground pt-1">Aguardando aprovação</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
