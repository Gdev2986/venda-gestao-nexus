
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Truck, Clock, CheckCircle, Package, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const LogisticsDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Logística</h1>
          <p className="text-muted-foreground">
            Controle de máquinas e operações logísticas
          </p>
        </div>
        <Button>Cadastrar Nova Máquina</Button>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Máquinas
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
            <p className="text-xs text-muted-foreground">
              +12 no último mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Operação
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">
              90% da frota total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Manutenção
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              7% da frota total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes de Entrega
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">
              Programadas para esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Entregas</CardTitle>
            <CardDescription>
              Próximas entregas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Mercado Central Ltda.</p>
                    <Badge variant="outline">Hoje</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    3 máquinas • Local: São Paulo, SP
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <div className="mr-4">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Padaria Nova Era</p>
                    <Badge variant="outline">Amanhã</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    1 máquina • Local: Guarulhos, SP
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <div className="mr-4">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Auto Peças Silva</p>
                    <Badge variant="outline">04/05/2025</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2 máquinas • Local: Rio de Janeiro, RJ
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm">
                Ver agenda completa
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status de Manutenção</CardTitle>
            <CardDescription>
              Máquinas em manutenção e tempos estimados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MQN-2458 • Mercado São João</span>
                  <span className="text-xs text-muted-foreground">3/5 dias</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MQN-1897 • Drogaria Silva</span>
                  <span className="text-xs text-muted-foreground">2/7 dias</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MQN-3201 • Padaria Estrela</span>
                  <span className="text-xs text-muted-foreground">4/4 dias</span>
                </div>
                <Progress value={100} className="h-2" />
                <span className="text-xs text-green-500">Pronta para reentrega</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alerta de Manutenção</AlertTitle>
              <AlertDescription>
                5 máquinas possuem manutenção programada para a próxima semana.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
