
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SendNotificationForm from "@/components/admin/notifications/SendNotificationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminNotificationsTab = () => {
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [userNotifications, setUserNotifications] = useState(true);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificações foram atualizadas."
    });
  };

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notifications" className="text-base font-medium">
                    Notificações do Sistema
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre atualizações do sistema e manutenção
                  </p>
                </div>
                <Switch 
                  id="system-notifications" 
                  checked={systemNotifications} 
                  onCheckedChange={setSystemNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="payment-notifications" className="text-base font-medium">
                    Notificações de Pagamentos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre novos pagamentos e solicitações
                  </p>
                </div>
                <Switch 
                  id="payment-notifications" 
                  checked={paymentNotifications} 
                  onCheckedChange={setPaymentNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="user-notifications" className="text-base font-medium">
                    Notificações de Usuários
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas sobre novas contas e atualizações de perfil
                  </p>
                </div>
                <Switch 
                  id="user-notifications" 
                  checked={userNotifications} 
                  onCheckedChange={setUserNotifications}
                />
              </div>
              
              <Button onClick={handleSaveSettings} className="mt-4">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Nova Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <SendNotificationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
