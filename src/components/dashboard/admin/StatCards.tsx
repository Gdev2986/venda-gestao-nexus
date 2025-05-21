
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  stats: {
    totalSales: number;
    grossSales: number;
    netSales: number;
    pendingRequests: number;
    expenses?: number;
    totalCommissions: number;
    currentBalance?: number;
    salesGrowth: number;
    isGrowthPositive: boolean;
  };
  isLoading: boolean;
}

const StatCards = ({ stats, isLoading }: StatCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Gross Sales */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription>Valor Bruto</CardDescription>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {formatCurrency(stats.grossSales)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Total transacionado
          </div>
        </CardContent>
      </Card>
      
      {/* Net Sales */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription>Valor Líquido</CardDescription>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {formatCurrency(stats.netSales)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Margem de {((stats.netSales / stats.grossSales) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Requests */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription>Solicitações Pendentes</CardDescription>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {stats.pendingRequests}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Aguardando atendimento
          </div>
        </CardContent>
      </Card>
      
      {/* Expenses or Current Balance */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription>{stats.expenses ? "Despesas" : "Saldo Atual"}</CardDescription>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {formatCurrency(stats.expenses || stats.currentBalance || 0)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {stats.expenses ? "Total de despesas" : "Disponível"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
