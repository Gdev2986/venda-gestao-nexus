
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";

const FinancialDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel Financeiro" 
        description="Visão geral das finanças do sistema"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 124.500,00</div>
            <p className="text-sm text-muted-foreground mt-2">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.780,00</div>
            <p className="text-sm text-muted-foreground mt-2">8 solicitações</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissões Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 7.590,00</div>
            <p className="text-sm text-muted-foreground mt-2">12 parceiros</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle>Fluxo de Caixa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de fluxo de caixa será exibido aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Pagamento", from: "Cliente ABC", value: "R$ 2.500,00", date: "22/04/2025" },
                  { type: "Comissão", from: "Parceiro XYZ", value: "R$ 1.200,00", date: "21/04/2025" },
                  { type: "Reembolso", from: "Cliente DEF", value: "R$ 350,00", date: "20/04/2025" },
                  { type: "Comissão", from: "Parceiro 123", value: "R$ 980,00", date: "19/04/2025" },
                ].map((req, i) => (
                  <div key={i} className="flex justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{req.type}</p>
                      <p className="text-xs text-muted-foreground">De: {req.from}</p>
                      <p className="text-xs text-muted-foreground">{req.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{req.value}</p>
                      <Button variant="link" size="sm" className="h-auto p-0">Ver</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={PATHS.FINANCIAL.REQUESTS}>Ver Todas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
