
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export const SystemTab = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
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
        <CardDescription>
          Gerencie as configurações globais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, o sistema fica disponível apenas para administradores. 
                  Útil para atualizações ou correções críticas.
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={maintenance}
                onCheckedChange={toggleMaintenance}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações do Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa ou desativa todas as notificações automáticas do sistema.
                  Inclui alertas sobre pagamentos, usuários e eventos do sistema.
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debugMode">Modo de Depuração</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa logs detalhados e ferramentas de diagnóstico para resolução de problemas.
                  Use apenas durante solução de problemas para evitar sobrecarga do sistema.
                </p>
              </div>
              <Switch
                id="debugMode"
                checked={debugMode}
                onCheckedChange={() => setDebugMode(!debugMode)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoBackup">Backup Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Quando ativado, o sistema realiza backups diários de todos os dados.
                  Recomendado para proteção contra perda de informações críticas.
                </p>
              </div>
              <Switch
                id="autoBackup"
                checked={autoBackup}
                onCheckedChange={() => setAutoBackup(!autoBackup)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
