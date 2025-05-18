
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SendNotificationForm from "@/components/admin/notifications/SendNotificationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole, NotificationType } from "@/types/enums";

const AdminNotificationsTab = () => {
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { toast } = useToast();

  const sendTestNotification = async () => {
    setIsTestLoading(true);

    try {
      // Get admin users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("role", UserRole.ADMIN)
        .limit(1);

      if (!profiles || profiles.length === 0) {
        throw new Error("No admin users found");
      }

      // Insert test notification
      const { error } = await supabase.from("notifications").insert({
        user_id: profiles[0].id,
        title: "Test Notification",
        message: "This is a test notification from the Admin panel.",
        type: NotificationType.SYSTEM,
        data: { isTest: true }
      });

      if (error) throw error;

      toast({
        title: "Test notification sent",
        description: "A test notification has been sent to admin users.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to send test notification: ${error.message}`,
      });
    } finally {
      setIsTestLoading(false);
    }
  };

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
              
              {/* Template management UI would go here */}
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
              <h3 className="text-lg font-medium">Testar Notificações</h3>
              <p className="text-muted-foreground mb-4">
                Envie uma notificação de teste para validar o sistema.
              </p>
              
              <Button 
                onClick={sendTestNotification} 
                disabled={isTestLoading}
              >
                {isTestLoading ? "Enviando..." : "Enviar Notificação de Teste"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationsTab;
