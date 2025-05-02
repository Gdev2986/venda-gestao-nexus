
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FinancialDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Visão geral da situação financeira atual
          </p>
        </div>
        <Button>Gerar Relatório</Button>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Total (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 243.890,00</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas Totais (Mês)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 85.421,00</div>
            <p className="text-xs text-muted-foreground">
              +3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lucro Líquido (Mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 158.469,00</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo em Caixa
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 487.312,00</div>
            <p className="text-xs text-muted-foreground">
              Atualizado em 01/05/2025
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Pagamento</CardTitle>
            <CardDescription>
              Status das solicitações recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mercado Central Ltda.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 5.420,00 • Aprovado (01/05/2025)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-yellow-100">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Farmácia Saúde Total
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 3.210,00 • Pendente (30/04/2025)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-yellow-100">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Auto Peças Silva
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ 2.850,00 • Pendente (30/04/2025)
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-center">
              <Button variant="outline" size="sm">
                Ver todas as solicitações
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertas Financeiros</CardTitle>
            <CardDescription>
              Ações que requerem sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pagamento de Comissões</AlertTitle>
                <AlertDescription>
                  12 parceiros aguardam pagamento de comissões no valor total de R$ 28.340,00 (vencimento: 05/05).
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Relatórios Pendentes</AlertTitle>
                <AlertDescription>
                  Relatório mensal de abril precisa ser enviado até 05/05.
                </AlertDescription>
              </Alert>
              
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Despesas Programadas</AlertTitle>
                <AlertDescription>
                  4 despesas programadas totalizam R$ 12.450,00 para a próxima semana.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
