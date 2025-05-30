
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, DollarSign, CreditCard, Award } from "lucide-react";

interface PeriodStats {
  totalSales: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  officeCommission: number;
}

interface SalesStatCardsProps {
  periodStats: PeriodStats;
  isLoading: boolean;
}

export const SalesStatCards = ({ periodStats, isLoading }: SalesStatCardsProps) => {
  const { totalSales, totalGrossAmount, totalNetAmount, officeCommission } = periodStats;

  const stats = [
    {
      title: "Total de Vendas",
      value: isLoading ? "..." : totalSales.toLocaleString('pt-BR'),
      icon: CreditCard,
      color: "text-blue-600",
      borderColor: "border-l-blue-500",
      subtitle: "Transações realizadas"
    },
    {
      title: "Valor Bruto",
      value: isLoading ? "..." : formatCurrency(totalGrossAmount),
      icon: DollarSign,
      color: "text-green-600",
      borderColor: "border-l-green-500",
      subtitle: "Total transacionado"
    },
    {
      title: "Valor Líquido",
      value: isLoading ? "..." : formatCurrency(totalNetAmount),
      icon: TrendingUp,
      color: "text-purple-600",
      borderColor: "border-l-purple-500",
      subtitle: `Margem de ${((totalNetAmount / totalGrossAmount) * 100 || 0).toFixed(1)}%`
    },
    {
      title: "Comissão Escritório",
      value: isLoading ? "..." : formatCurrency(officeCommission),
      icon: Award,
      color: "text-orange-600",
      borderColor: "border-l-orange-500",
      subtitle: "Comissão gerada no período"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`border-l-4 ${stat.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
