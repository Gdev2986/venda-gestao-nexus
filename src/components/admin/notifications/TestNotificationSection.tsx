
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";
import { NotificationType } from "@/types/notification.types";
import { useAuth } from "@/contexts/AuthContext";

export const TestNotificationSection = () => {
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { user } = useAuth();

  const sendTestNotification = async () => {
    setIsTestLoading(true);

    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Get all admin users to send test to
      const { data: adminProfiles, error: adminError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", UserRole.ADMIN);

      if (adminError) throw adminError;
      
      if (!adminProfiles || adminProfiles.length === 0) {
        throw new Error("Nenhum usuário administrador encontrado");
      }
      
      // Insert test notification for all admins
      const testNotifications = adminProfiles.map(profile => ({
        user_id: profile.id,
        title: "Notificação de Teste",
        message: "Esta é uma notificação de teste do painel de administração.",
        type: NotificationType.SYSTEM,
        data: { isTest: true }
      }));
      
      // Since we're working with an array of notifications, we need to use .insert()
      const { error } = await supabase
        .from("notifications")
        .insert(testNotifications);

      if (error) throw error;

      toast({
        title: "Notificação de teste enviada",
        description: "Uma notificação de teste foi enviada para todos os administradores."
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Falha ao enviar notificação de teste: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
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
  );
};
