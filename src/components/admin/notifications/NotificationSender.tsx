
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";
import { supabase } from "@/integrations/supabase/client";
import { NotificationType } from "@/types/notification.types";

interface NotificationSenderProps {
  user: any | null;
}

export const NotificationSender = ({ user }: NotificationSenderProps) => {
  const sendNotification = async (notification: any) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar notificações",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log("Preparing to send notification:", notification);

      // Check if we're sending to specific roles
      if (notification.recipient_roles && notification.recipient_roles.length > 0) {
        // Get users with the specified roles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id")
          .in("role", notification.recipient_roles);
          
        if (profilesError) throw profilesError;
        
        if (!profiles || profiles.length === 0) {
          toast({
            title: "Aviso",
            description: "Nenhum destinatário encontrado - Não há usuários com as funções selecionadas"
          });
          return false;
        }
        
        // Create one notification for each user
        const notificationsToInsert = profiles.map(profile => ({
          user_id: profile.id,
          title: notification.title,
          message: notification.message,
          type: notification.type as NotificationType,
          data: notification.data || {}
        }));
        
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);
          
        if (insertError) throw insertError;
      } else {
        // Handle 'all' users case
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id");
          
        if (profilesError) throw profilesError;
        
        if (!profiles || profiles.length === 0) {
          toast({
            title: "Erro",
            description: "Não foram encontrados usuários para enviar notificações",
            variant: "destructive"
          });
          return false;
        }
        
        // Create one notification for each user
        const notificationsToInsert = profiles.map(profile => ({
          user_id: profile.id,
          title: notification.title,
          message: notification.message,
          type: notification.type as NotificationType,
          data: notification.data || {}
        }));
        
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: `Falha ao enviar notificação: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <SendNotificationForm onSendNotification={sendNotification} />
      </CardContent>
    </Card>
  );
};
