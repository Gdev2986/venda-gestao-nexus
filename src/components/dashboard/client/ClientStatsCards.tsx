
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClientStatsCardsProps {
  currentBalance: number;
  periodGross: number;
  periodNet: number;
  totalTransactions: number;
  totalTaxes?: number;
  isLoading?: boolean;
}

export const ClientStatsCards = ({
  currentBalance,
  periodGross,
  periodNet,
  totalTransactions,
  totalTaxes = 0,
  isLoading = false
}: ClientStatsCardsProps) => {
  const profitMargin = periodGross > 0 
    ? ((periodNet / periodGross) * 100).toFixed(1)
    : "0.0";

  const taxPercentage = periodGross > 0
    ? ((totalTaxes / periodGross) * 100).toFixed(1)
    : "0.0";

  const cards = [
    {
      title: "Saldo Atual",
      value: formatCurrency(currentBalance),
      subtitle: "Disponível para saque",
      icon: DollarSign,
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Faturamento Bruto",
      value: formatCurrency(periodGross),
      subtitle: "Valor total das vendas",
      icon: TrendingUp,
      borderColor: "border-l-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Faturamento Líquido",
      value: formatCurrency(periodNet),
      subtitle: `Margem líquida de ${profitMargin}%`,
      icon: TrendingDown,
      borderColor: "border-l-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Taxas Cobradas",
      value: formatCurrency(totalTaxes),
      subtitle: `${taxPercentage}% do faturamento`,
      icon: Percent,
      borderColor: "border-l-orange-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Transações",
      value: totalTransactions.toString(),
      subtitle: "Total no período",
      icon: CreditCard,
      borderColor: "border-l-indigo-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.borderColor} border-l-4 hover:shadow-md transition-shadow`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
