
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SendNotificationForm } from '@/components/admin/notifications/SendNotificationForm';

export default function AdminNotificationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Notificações e Alertas</h2>
      
      <Tabs defaultValue="send">
        <TabsList className="mb-4">
          <TabsTrigger value="send">Enviar Notificações</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send">
          <SendNotificationForm />
        </TabsContent>
        
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>Configure como e quando as notificações são enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-notifications" className="flex flex-col space-y-1">
                  <span>Notificações automáticas</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enviar notificações automáticas para eventos do sistema
                  </span>
                </Label>
                <Switch id="auto-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="payment-notifications" className="flex flex-col space-y-1">
                  <span>Notificações de pagamento</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notificar clientes sobre mudanças no status de pagamento
                  </span>
                </Label>
                <Switch id="payment-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="system-notifications" className="flex flex-col space-y-1">
                  <span>Notificações de sistema</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enviar notificações sobre manutenção do sistema
                  </span>
                </Label>
                <Switch id="system-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Notificação</CardTitle>
              <CardDescription>Gerencie os templates de notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Os templates de notificação permitem padronizar as mensagens enviadas pelo sistema.
              </p>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Boas-vindas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Pagamento recebido
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Pagamento aprovado
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Pagamento rejeitado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
