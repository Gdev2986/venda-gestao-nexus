
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import ClientActions from "@/components/dashboard/ClientActions";

interface SidebarContentProps {
  loading: boolean;
}

export function SidebarContent({ loading }: SidebarContentProps) {
  return (
    <div className="space-y-6">
      <ClientActions />
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(2).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">Fatura mensal</p>
                  <p className="text-sm text-muted-foreground">Vencimento em 15/05/2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(399)}</p>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pendente</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                <div className="flex gap-2 items-center">
                  <p className="font-medium">Taxa de processamento</p>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(120.50)}</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Pago</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col space-y-1 p-2 border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Manutenção preventiva</p>
              <p className="text-sm text-muted-foreground">15/05/2025 • 14:00</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 border-blue-200" variant="outline">Agendado</Badge>
            </div>
            <div className="flex flex-col space-y-1 p-2 border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Vencimento de fatura</p>
              <p className="text-sm text-muted-foreground">20/05/2025 • Final do dia</p>
              <Badge className="w-fit mt-1 bg-amber-100 text-amber-800 border-amber-200" variant="outline">Pendente</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-2 border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Nova funcionalidade disponível</p>
              <p className="text-sm text-muted-foreground mt-1">Pagamentos por aproximação agora disponíveis!</p>
              <p className="text-xs text-muted-foreground mt-1">12/04/2025</p>
            </div>
            <div className="p-2 border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Alerta de segurança</p>
              <p className="text-sm text-muted-foreground mt-1">Atualize sua senha regularmente para maior segurança.</p>
              <p className="text-xs text-muted-foreground mt-1">05/04/2025</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-3 text-primary">Ver todas notificações</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SidebarContent;
