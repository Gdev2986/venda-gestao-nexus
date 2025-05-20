import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";
import { NotificationType } from "@/types/notification.types";
import { useAuth } from "@/contexts/AuthContext";

const AdminNotificationsTab = () => {
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendNotification = async (notification: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to send notifications",
      });
      return false;
    }

    try {
      console.log("Preparing to send notification:", notification);

      let query;
      
      if (notification.recipient_roles && notification.recipient_roles.length > 0) {
        // Send to specific roles
        console.log("Sending to specific roles:", notification.recipient_roles);
        
        // First, get users with the specified roles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id")
          .in("role", notification.recipient_roles);
          
        if (profilesError) throw profilesError;
        
        if (!profiles || profiles.length === 0) {
          toast({
            variant: "destructive",
            title: "Nenhum destinatário encontrado",
            description: "Não há usuários com as funções selecionadas"
          });
          return false;
        }
        
        // Then, insert notifications for each user
        const notificationsToInsert = profiles.map(profile => ({
          user_id: profile.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          recipient_roles: notification.recipient_roles
        }));
        
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);
          
        if (insertError) throw insertError;
      } else {
        // Handle 'all' users case
        console.log("Sending to all users");
        
        // Get all profiles (potentially with role filtering in the future)
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id");
          
        if (profilesError) throw profilesError;
        
        // Create a notification for each user
        const notificationsToInsert = profiles.map(profile => ({
          user_id: profile.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          recipient_roles: [] // Empty array means no role filtering
        }));
        
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso",
      });
      return true;
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to send notification: ${error.message}`,
      });
      return false;
    }
  };

  const sendTestNotification = async () => {
    setIsTestLoading(true);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Get all admin users to send test to
      const { data: adminProfiles, error: adminError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", UserRole.ADMIN);

      if (adminError) throw adminError;
      
      if (!adminProfiles || adminProfiles.length === 0) {
        throw new Error("No admin users found");
      }
      
      // Insert test notification for all admins - Make sure to use a valid literal type
      const testNotifications = adminProfiles.map(profile => ({
        user_id: profile.id,
        title: "Notificação de Teste",
        message: "Esta é uma notificação de teste do painel de administração.",
        type: "SYSTEM" as const, // Use string literal with "as const" to satisfy TypeScript
        data: { isTest: true },
        recipient_roles: [UserRole.ADMIN] // Explicitly send to ADMIN role
      }));
      
      const { error } = await supabase
        .from("notifications")
        .insert(testNotifications);

      if (error) throw error;

      toast({
        title: "Notificação de teste enviada",
        description: "Uma notificação de teste foi enviada para todos os administradores.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao enviar notificação de teste: ${error.message}`,
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
              <SendNotificationForm onSendNotification={sendNotification} />
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
