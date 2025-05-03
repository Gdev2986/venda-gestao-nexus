
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meu Painel" 
        description="Bem-vindo de volta! Aqui está o resumo da sua conta."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,78</div>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to={PATHS.USER.PAYMENTS}>Ver histórico</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Minhas Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">2 ativas</Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">1 em manutenção</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimas Vendas (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.432,10</div>
            <p className="text-sm text-muted-foreground mt-2">146 transações</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PageWrapper>
            <h3 className="text-lg font-medium mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              {[
                { date: "Hoje", title: "Venda aprovada", value: "R$ 152,30", status: "success" },
                { date: "Ontem", title: "Nova venda", value: "R$ 78,50", status: "success" },
                { date: "Ontem", title: "Nova venda", value: "R$ 210,00", status: "success" },
                { date: "3 dias atrás", title: "Manutenção agendada", value: "Terminal #2", status: "warning" },
                { date: "5 dias atrás", title: "Pagamento recebido", value: "R$ 1.240,80", status: "success" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'success' ? 'bg-green-500' : 
                      item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="font-medium">{item.value}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">Ver Mais</Button>
          </PageWrapper>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.USER.PAYMENTS}>Solicitar Pagamento</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.USER.MACHINES}>Ver minhas máquinas</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={PATHS.USER.SUPPORT}>Abrir chamado</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
