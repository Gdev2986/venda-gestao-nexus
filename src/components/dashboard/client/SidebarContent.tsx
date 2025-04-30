
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
