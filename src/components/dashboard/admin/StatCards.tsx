
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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {/* Total Sales Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Vendas Totais</CardTitle>
          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.totalSales)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                <span className="flex items-center">
                  {stats.isGrowthPositive ? (
                    <TrendingUp className="h-2 w-2 md:h-3 md:w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-2 w-2 md:h-3 md:w-3 text-red-600 mr-1" />
                  )}
                  {stats.salesGrowth}% em relação ao mês anterior
                </span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Gross Sales Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Valor Bruto</CardTitle>
          <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.grossSales)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Valor total bruto
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Net Sales Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Valor Líquido</CardTitle>
          <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.netSales)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Margem de {((stats.netSales / stats.grossSales) * 100).toFixed(1)}%
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Solicitações</CardTitle>
          <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {stats.pendingRequests}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Aguardando aprovação
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Despesas</CardTitle>
          <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.expenses)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                No período
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Commissions Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Comissões</CardTitle>
          <PieChart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.totalCommissions)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Parceiros + empresa
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Balance Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Caixa Atual</CardTitle>
          <Wallet className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(stats.currentBalance)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
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
