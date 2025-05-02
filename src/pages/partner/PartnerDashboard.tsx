
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users, Activity, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const PartnerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.user_metadata?.name || "Parceiro"}</h1>
          <p className="text-muted-foreground">
            Dashboard de desempenho e operações
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 nos últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Total
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,00</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissão do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.427,72</div>
            <p className="text-xs text-muted-foreground">
              Previsão para 10/05/2025
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metas do Mês</CardTitle>
            <CardDescription>
              Progresso das metas para Maio/2025
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Novos Clientes (Meta: 5)</span>
                <span className="text-sm font-medium">2/5</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Faturamento (Meta: R$ 60.000,00)</span>
                <span className="text-sm font-medium">R$ 45.231,00</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Atendimentos (Meta: 20)</span>
                <span className="text-sm font-medium">18/20</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes</CardTitle>
            <CardDescription>
              Por faturamento no mês atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Mercado Central Ltda.</div>
                  <div className="text-sm text-muted-foreground">
                    R$ 8.452,00
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Padaria Nova Era</div>
                  <div className="text-sm text-muted-foreground">
                    R$ 6.128,00
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary/60 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">3</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Farmácia Saúde Total</div>
                  <div className="text-sm text-muted-foreground">
                    R$ 5.842,00
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lembrete</AlertTitle>
              <AlertDescription>
                Fechamento das comissões acontecerá no dia 05/05/2025.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;
