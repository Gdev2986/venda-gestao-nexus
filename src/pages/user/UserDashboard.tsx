
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.user_metadata?.name || "Cliente"}</h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua conta e operações.
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Atual
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.250,00</div>
            <p className="text-xs text-muted-foreground">
              Última atualização: 01/05/2025
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento (Maio)
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.423,00</div>
            <p className="text-xs text-muted-foreground">
              +10% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Máquinas
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Todas operando normalmente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operações Recentes</CardTitle>
            <CardDescription>
              Últimos movimentos da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Venda #254812
                  </p>
                  <p className="text-sm text-muted-foreground">
                    30/04/2025 - R$ 120,00
                  </p>
                </div>
                <div className="text-sm font-medium text-green-500">+R$ 120,00</div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Venda #254811
                  </p>
                  <p className="text-sm text-muted-foreground">
                    30/04/2025 - R$ 85,50
                  </p>
                </div>
                <div className="text-sm font-medium text-green-500">+R$ 85,50</div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full p-2 bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pagamento Recebido
                  </p>
                  <p className="text-sm text-muted-foreground">
                    28/04/2025 - R$ 1.250,00
                  </p>
                </div>
                <div className="text-sm font-medium text-green-500">+R$ 1.250,00</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button className="flex flex-col h-auto py-4">
                  <span>Solicitar Pagamento</span>
                  <span className="text-xs font-normal">PIX, Transferência</span>
                </Button>
                <Button className="flex flex-col h-auto py-4" variant="outline">
                  <span>Ver Relatório</span>
                  <span className="text-xs font-normal">Vendas e Faturamento</span>
                </Button>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Aviso Importante</AlertTitle>
                <AlertDescription>
                  Lembre-se de solicitar pagamentos até o dia 5 de cada mês.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
