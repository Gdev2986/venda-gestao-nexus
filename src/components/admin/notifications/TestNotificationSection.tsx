
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationType } from "@/types/notification.types";

export const TestNotificationSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const sendTestNotification = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para testar notificações",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      // Send a test notification to current user
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: "Notificação de teste",
          message: "Esta é uma notificação de teste enviada em " + new Date().toLocaleString(),
          type: NotificationType.SYSTEM,
          data: { isTest: true }
        });

      if (error) throw error;

      toast({
        title: "Notificação de teste enviada",
        description: "Verifique seu painel de notificações",
      });
    } catch (error: any) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Erro",
        description: `Falha ao enviar notificação de teste: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testar Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Envie uma notificação de teste para o seu próprio usuário para verificar se o sistema está funcionando corretamente.
        </p>
        <Button 
          onClick={sendTestNotification} 
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar Notificação de Teste"}
        </Button>
      </CardContent>
    </Card>
  );
};
