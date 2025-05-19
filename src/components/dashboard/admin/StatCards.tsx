
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
      <div className="grid grid-cols-1 gap-4">
        {/* Full width card for Total Sales */}
        <Skeleton className="h-28" />
        
        {/* Two cards in one row for Gross and Net */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        
        {/* Full width card for Office Commission */}
        <Skeleton className="h-28" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Sales - Full width on mobile, 25% width on desktop */}
      <Card className="col-span-1 md:col-span-4">
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
      
      {/* Gross Sales - 50% width on desktop, full width on mobile */}
      <Card className="col-span-1 md:col-span-2">
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
      
      {/* Net Sales - 50% width on desktop, full width on mobile */}
      <Card className="col-span-1 md:col-span-2">
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
      
      {/* Office Commission - Full width on mobile, 25% width on desktop */}
      <Card className="col-span-1 md:col-span-4">
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
