
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";

const AdminNotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">Enviar Notificações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <SendNotificationForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium">Templates de Notificação</h3>
              <p className="text-muted-foreground">
                Configure templates para diferentes tipos de notificação.
              </p>
              
              <div className="border rounded-lg p-4 mt-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Funcionalidade em desenvolvimento. Os templates serão disponibilizados em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium">Configurações de Notificação</h3>
              <p className="text-muted-foreground mb-4">
                Configure as opções globais do sistema de notificações.
              </p>
              
              <div className="border rounded-lg p-4 mt-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Configurações avançadas serão disponibilizadas em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationsTab;
