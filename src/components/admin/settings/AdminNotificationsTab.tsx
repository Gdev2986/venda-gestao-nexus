
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";

const AdminNotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences">
            <TabsList className="mb-4">
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences">
              <NotificationPreferences />
            </TabsContent>
            
            <TabsContent value="settings">
              <NotificationsSettings />
            </TabsContent>
            
            <TabsContent value="send">
              <SendNotificationForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsTab;
