
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-36 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Total Sales - Full width */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Faturamento do mês</CardDescription>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {formatCurrency(stats.totalSales)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            <div className={`flex items-center ${stats.isGrowthPositive ? 'text-green-500' : 'text-red-500'}`}>
              {stats.isGrowthPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{stats.salesGrowth}% em relação ao mês anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Two cards side by side: Gross and Net Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Bruto</CardDescription>
            <CardTitle className="text-xl md:text-2xl font-bold">
              {formatCurrency(stats.grossSales)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Valor total bruto
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Líquido</CardDescription>
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
      </div>
      
      {/* Office Commission - Full width */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Comissão Escritório</CardDescription>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            {formatCurrency(stats.totalCommissions)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Comissões do mês atual até o momento
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
