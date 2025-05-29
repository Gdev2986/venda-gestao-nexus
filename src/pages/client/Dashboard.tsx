
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { ClientStatsCards } from "@/components/dashboard/client/ClientStatsCards";
import { ClientPeriodFilter } from "@/components/dashboard/client/ClientPeriodFilter";
import { ClientSalesTable } from "@/components/dashboard/client/ClientSalesTable";
import { useClientBalance } from "@/hooks/use-client-balance";
import { useAuth } from "@/hooks/use-auth";
import { PaymentMethod } from "@/types";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Activity, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

// Mock data para demonstração - em produção viria da API
const generateMockSales = (startDate: Date, endDate: Date) => {
  const sales = [];
  const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
  
  for (let i = 0; i < 45; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const grossAmount = Math.random() * 500 + 50;
    const netAmount = grossAmount * (0.85 + Math.random() * 0.1); // 85-95% do bruto
    const method = methods[Math.floor(Math.random() * methods.length)];
    const installments = method === PaymentMethod.CREDIT && Math.random() > 0.3 
      ? Math.floor(Math.random() * 20) + 2 
      : undefined;

    sales.push({
      id: `sale-${i}`,
      date: randomDate.toISOString(),
      code: `TXN${(1000 + i).toString()}`,
      terminal: `T${Math.floor(Math.random() * 5) + 1}`,
      gross_amount: grossAmount,
      net_amount: netAmount,
      payment_method: method,
      installments
    });
  }
  
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useClientBalance();
  const [isLoading, setIsLoading] = useState(true);
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [sales, setSales] = useState<any[]>([]);

  // Estatísticas calculadas das vendas
  const periodGross = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const periodNet = sales.reduce((sum, sale) => sum + sale.net_amount, 0);
  const totalTransactions = sales.length;

  const handlePeriodChange = (startDate: Date, endDate: Date) => {
    setPeriodStart(startDate);
    setPeriodEnd(endDate);
    
    setIsLoading(true);
    // Simular carregamento de dados
    setTimeout(() => {
      const mockSales = generateMockSales(startDate, endDate);
      setSales(mockSales);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle"
      />

      {/* Balance Card - sempre visível, sem filtro de data */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
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

      {/* Filtro de Período */}
      <ClientPeriodFilter onPeriodChange={handlePeriodChange} />

      {/* Cards de Estatísticas */}
      <ClientStatsCards
        currentBalance={balance || 0}
        periodGross={periodGross}
        periodNet={periodNet}
        totalTransactions={totalTransactions}
        isLoading={isLoading || balanceLoading}
      />

      {/* Tabela de Vendas */}
      <ClientSalesTable
        sales={sales}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClientDashboard;
