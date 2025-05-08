
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const SystemTab = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();
  
  const toggleMaintenance = () => {
    setMaintenance(!maintenance);
    toast({
      title: !maintenance ? "Modo manutenção ativado" : "Modo manutenção desativado",
      description: !maintenance 
        ? "O sistema está em modo de manutenção. Apenas administradores podem acessar." 
        : "O sistema está disponível para todos os usuários."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardContent className="pl-0 pb-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
              <Switch
                id="maintenanceMode"
                checked={maintenance}
                onCheckedChange={toggleMaintenance}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificações</Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
