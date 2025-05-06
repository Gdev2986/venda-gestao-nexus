
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  FileText,
  Wallet,
  PieChart
} from "lucide-react";
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
    totalClients?: number;
    totalMachines?: number;
  };
  isLoading?: boolean;
}

const StatCards = ({ stats, isLoading = false }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Total Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
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

      {/* Gross Sales Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valor Bruto</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.grossSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor total bruto
              </p>
            </>
          )}
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
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.netSales)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Margem de {((stats.netSales / stats.grossSales) * 100).toFixed(1)}%
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando aprovação
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.expenses)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                No período
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Commissions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Comissões</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalCommissions)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Parceiros + empresa
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Caixa Atual</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
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
                Total disponível
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
