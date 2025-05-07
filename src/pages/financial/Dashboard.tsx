
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, ArrowDown, CircleDollarSign, Clock, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const FinancialDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Financeiro" 
        description="Visão geral da área financeira"
      />
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de pagamentos em aberto</CardDescription>
            <CardTitle className="text-3xl font-bold">R$ 145.730,00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>12% desde o mês anterior</span>
              </div>
              <span className="text-gray-500">42 solicitações</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pagamentos realizados (mês)</CardDescription>
            <CardTitle className="text-3xl font-bold">R$ 89.450,00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-red-600">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>3% desde o mês anterior</span>
              </div>
              <span className="text-gray-500">35 transações</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxas geradas (mês)</CardDescription>
            <CardTitle className="text-3xl font-bold">R$ 12.380,00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>5% desde o mês anterior</span>
              </div>
              <span className="text-gray-500">240 transações</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Solicitações pendentes</CardDescription>
            <CardTitle className="text-3xl font-bold">18</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-amber-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Tempo médio: 2.3 dias</span>
              </div>
              <span className="text-gray-500">Prioridade alta: 5</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CircleDollarSign className="h-5 w-5 mr-2" /> 
              Solicitações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gerencie as solicitações pendentes de pagamento e análise financeira.
            </p>
            <Button className="w-full" asChild>
              <Link to={PATHS.FINANCIAL.REQUESTS}>
                Ver Solicitações <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" /> 
              Clientes e Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Acesse a lista de clientes e gere relatórios financeiros.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to={PATHS.FINANCIAL.CLIENTS}>Clientes</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={PATHS.FINANCIAL.REPORTS}>Relatórios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2" /> 
              Relatórios Financeiros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gere relatórios financeiros detalhados para análise e tomada de decisões.
            </p>
            <Button className="w-full" asChild>
              <Link to={PATHS.FINANCIAL.REPORTS}>
                Acessar Relatórios <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <PageWrapper>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Últimas Atividades Financeiras</h3>
          
          <div className="space-y-2">
            {[
              { date: "12/04/2025", description: "Pagamento aprovado", client: "Tech Solutions", value: 3450.00 },
              { date: "11/04/2025", description: "Taxa atualizada", client: "Digital Commerce", value: 245.50 },
              { date: "10/04/2025", description: "Nova solicitação", client: "Market Innovations", value: 5600.00 },
              { date: "09/04/2025", description: "Pagamento rejeitado", client: "Smart Services", value: 1240.00 },
              { date: "08/04/2025", description: "Comissão processada", client: "Partner Solutions", value: 780.25 }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                  <span className="font-medium">{activity.description}</span>
                  <span className="text-sm">{activity.client}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">R$ {activity.value.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default FinancialDashboard;
