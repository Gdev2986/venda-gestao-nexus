
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { notificationService } from "@/services/NotificationService";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminNotificationsTab = () => {
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [userNotifications, setUserNotifications] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificações foram atualizadas."
    });
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a mensagem da notificação.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      let success = false;

      if (target === "all") {
        // Get all users
        const { data: users } = await supabase
          .from('profiles')
          .select('id');
        
        if (users && users.length > 0) {
          // Send notification to each user
          const promises = users.map(user => 
            notificationService.sendNotification(
              user.id, 
              title, 
              message, 
              "SYSTEM"
            )
          );
          
          await Promise.all(promises);
          success = true;
        }
      } else {
        // Get users with specific role
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', target);
        
        if (users && users.length > 0) {
          // Send notification to each user with the specified role
          const promises = users.map(user => 
            notificationService.sendNotification(
              user.id, 
              title, 
              message, 
              "SYSTEM"
            )
          );
          
          await Promise.all(promises);
          success = true;
        }
      }

      if (success) {
        toast({
          title: "Notificação enviada",
          description: "A notificação foi enviada com sucesso."
        });
        
        // Reset form
        setTitle("");
        setMessage("");
        setTarget("all");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a notificação.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-notifications" className="text-base font-medium">
                Notificações do Sistema
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre atualizações do sistema e manutenção
              </p>
            </div>
            <Switch 
              id="system-notifications" 
              checked={systemNotifications} 
              onCheckedChange={setSystemNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment-notifications" className="text-base font-medium">
                Notificações de Pagamentos
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre novos pagamentos e solicitações
              </p>
            </div>
            <Switch 
              id="payment-notifications" 
              checked={paymentNotifications} 
              onCheckedChange={setPaymentNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="user-notifications" className="text-base font-medium">
                Notificações de Usuários
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre novas contas e atualizações de perfil
              </p>
            </div>
            <Switch 
              id="user-notifications" 
              checked={userNotifications} 
              onCheckedChange={setUserNotifications}
            />
          </div>
          
          <Button onClick={handleSaveSettings} className="mt-4">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Nova Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="title">
                Título
              </Label>
              <Input 
                id="title" 
                placeholder="Título da notificação" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="target">
                Destinatários
              </Label>
              <Select 
                value={target} 
                onValueChange={(value) => setTarget(value)}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Selecione os destinatários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value="CLIENT">Apenas clientes</SelectItem>
                  <SelectItem value="PARTNER">Apenas parceiros</SelectItem>
                  <SelectItem value="ADMIN">Apenas administradores</SelectItem>
                  <SelectItem value="FINANCIAL">Apenas financeiro</SelectItem>
                  <SelectItem value="LOGISTICS">Apenas logística</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="message">
                Mensagem
              </Label>
              <Textarea 
                id="message" 
                placeholder="Digite a mensagem da notificação..." 
                className="min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSendNotification}
                disabled={isSending}
              >
                {isSending ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
