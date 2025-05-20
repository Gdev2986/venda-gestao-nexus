
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationSender } from "@/components/admin/notifications/NotificationSender";
import { TemplatesTab } from "@/components/admin/notifications/TemplatesTab";
import { TestNotificationSection } from "@/components/admin/notifications/TestNotificationSection";
import { useAuth } from "@/contexts/AuthContext";

const AdminNotificationsTab = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">Enviar Notificações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-4 pt-4">
          <NotificationSender user={user} />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 pt-4">
          <TemplatesTab />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <TestNotificationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationsTab;
