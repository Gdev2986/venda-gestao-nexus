
import { useState } from "react";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client"; 
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification.types";

const AdminNotificationsTab = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendNotification = async (notification: Partial<Notification>) => {
    try {
      setIsSubmitting(true);
      
      // Determine target users based on recipients field
      let userIdsList: string[] = [];
      
      if (notification.recipients === "all") {
        // Get all user IDs
        const { data, error } = await supabase.from("profiles").select("id");
        if (error) throw error;
        userIdsList = data.map(user => user.id);
      } else if (notification.recipients === "admins") {
        // Get admin user IDs
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .in("role", ["ADMIN", "FINANCIAL", "MANAGER"]);
        if (error) throw error;
        userIdsList = data.map(user => user.id);
      } else if (notification.recipients === "clients") {
        // Get client user IDs
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "CLIENT");
        if (error) throw error;
        userIdsList = data.map(user => user.id);
      }
      
      // Create notification entries for each user
      const notificationPromises = userIdsList.map(userId => {
        return supabase.from("notifications").insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {}
        });
      });
      
      await Promise.all(notificationPromises);
      
      toast({
        title: "Notificação enviada",
        description: `Notificação enviada para ${userIdsList.length} usuários`,
      });
      
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Notificação</CardTitle>
          <CardDescription>
            Envie notificações para todos os usuários do sistema ou grupos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SendNotificationForm onSendNotification={handleSendNotification} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsTab;
