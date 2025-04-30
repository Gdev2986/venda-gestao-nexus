
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
import { Calendar, CheckCircle2 } from "lucide-react";
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
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Manutenção preventiva</p>
                <p className="text-sm text-muted-foreground">15/05/2025 • 14:00</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Vencimento de fatura</p>
                <p className="text-sm text-muted-foreground">20/05/2025 • Final do dia</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SidebarContent;
