
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BalanceCardsProps {
  clientBalance: number;
}

export const BalanceCards = ({ clientBalance }: BalanceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Saldo Disponível</CardTitle>
          <CardDescription>Valor disponível para solicitação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <WalletIcon className="h-8 w-8 mr-2 text-primary" />
            <div className="text-3xl font-bold">{formatCurrency(clientBalance)}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Limite de Retirada</p>
              <p className="text-sm text-muted-foreground">Até {formatCurrency(clientBalance)} por solicitação</p>
            </div>
            <div>
              <p className="font-medium">Prazo de Processamento</p>
              <p className="text-sm text-muted-foreground">Até 2 dias úteis após aprovação</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
