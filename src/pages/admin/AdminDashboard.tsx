
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, DollarSign, Users, Building2, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BarChart, LineChart } from "@/components/charts";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Dados de exemplo para os gráficos
  const salesData = [
    { name: "Jan", total: 125000 },
    { name: "Fev", total: 134000 },
    { name: "Mar", total: 141000 },
    { name: "Abr", total: 160000 },
    { name: "Mai", total: 180000 },
  ];
  
  const paymentDistributionData = [
    { name: "PIX", value: 68 },
    { name: "Crédito", value: 23 },
    { name: "Débito", value: 9 },
  ];
  
  const topPartnersData = [
    { name: "João Silva", value: 38500 },
    { name: "Maria Souza", value: 32100 },
    { name: "Carlos Oliveira", value: 25600 },
    { name: "Fernanda Lima", value: 21400 },
    { name: "Roberto Santos", value: 18900 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral dos indicadores principais do sistema
          </p>
        </div>
        <Button>Gerar Relatório Completo</Button>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Brutas
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
              Total Líquido
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 158.469,00</div>
            <p className="text-xs text-muted-foreground">
              65% das vendas brutas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitações de Pagamento
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              8 pendentes de aprovação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissões Geradas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.680,00</div>
            <p className="text-xs text-muted-foreground">
              17.5% das vendas brutas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Caixa Atual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 487.312,00</div>
            <p className="text-xs text-muted-foreground">
              Atualizado em tempo real
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Faturamento Mensal</CardTitle>
            <CardDescription>
              Evolução das vendas nos últimos 5 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart 
                data={salesData}
                category="total"
                index="name"
                colors={["#2563eb"]}
                valueFormatter={(value: number) => 
                  `R$ ${new Intl.NumberFormat("pt-BR").format(value)}`
                }
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Top 5 Parceiros</CardTitle>
            <CardDescription>
              Por volume de vendas no mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPartnersData.map((partner, index) => (
                <div key={index} className="flex items-center">
                  <div className={`mr-4 h-8 w-8 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-500" :
                    index === 1 ? "bg-gray-300" :
                    index === 2 ? "bg-amber-700" :
                    "bg-muted"
                  }`}>
                    <span className="text-white text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{partner.name}</div>
                      <div className="text-sm font-medium">
                        R$ {partner.value.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="mt-1 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${partner.value / topPartnersData[0].value * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Crescimento de Clientes</CardTitle>
            <CardDescription>
              Novos clientes por mês no último semestre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart 
                data={[
                  { month: "Dez", clients: 34 },
                  { month: "Jan", clients: 38 },
                  { month: "Fev", clients: 42 },
                  { month: "Mar", clients: 47 },
                  { month: "Abr", clients: 53 },
                  { month: "Mai", clients: 58 },
                ]}
                category="clients"
                index="month"
                colors={["#10b981"]}
                valueFormatter={(value: number) => `${value} clientes`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Parceiros</CardTitle>
            <CardDescription>
              Resumo da performance dos parceiros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total de Parceiros</span>
              <span className="text-sm font-medium">28</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Parceiros Ativos</span>
              <span className="text-sm font-medium">24 (86%)</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Média de Clientes</span>
              <span className="text-sm font-medium">8.3 por parceiro</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Comissões Pendentes</span>
              <span className="text-sm font-medium">R$ 38.750,00</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Clientes</CardTitle>
            <CardDescription>
              Desempenho da base de clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total de Clientes</span>
              <span className="text-sm font-medium">234</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Clientes Ativos</span>
              <span className="text-sm font-medium">212 (91%)</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ticket Médio</span>
              <span className="text-sm font-medium">R$ 1,140.00</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Taxa de Retenção</span>
              <span className="text-sm font-medium">94%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
            <CardDescription>
              Ações que requerem sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Solicitações Pendentes</AlertTitle>
                <AlertDescription>
                  8 solicitações de pagamento aguardando revisão.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Comissões a Pagar</AlertTitle>
                <AlertDescription>
                  Prazo para pagamento de comissões encerra em 4 dias.
                </AlertDescription>
              </Alert>
              
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Novos Usuários</AlertTitle>
                <AlertDescription>
                  6 novos usuários registrados aguardando aprovação.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
