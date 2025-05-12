
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/services/NotificationService";

export const AdminNotificationsTab = () => {
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [userNotifications, setUserNotifications] = useState(true);
  
  // New state for notification sending form
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTarget, setNotificationTarget] = useState('all');
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();
  const { sendNotificationToRole } = useNotifications();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificações foram atualizadas."
    });
  };
  
  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o título e a mensagem da notificação."
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      if (notificationTarget === 'all') {
        // Send to all roles
        const roles = Object.values(UserRole);
        await Promise.all(
          roles.map(role => 
            sendNotificationToRole(
              {
                title: notificationTitle,
                message: notificationMessage,
                type: 'GENERAL' as NotificationType,
                data: {},
              },
              role
            )
          )
        );
      } else {
        // Send to specific role
        await sendNotificationToRole(
          {
            title: notificationTitle,
            message: notificationMessage,
            type: 'GENERAL' as NotificationType,
            data: {},
          },
          notificationTarget as UserRole
        );
      }
      
      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso."
      });
      
      // Reset form
      setNotificationTitle('');
      setNotificationMessage('');
      setNotificationTarget('all');
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a notificação."
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
                value={notificationTitle}
                onChange={e => setNotificationTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="target">
                Destinatários
              </Label>
              <Select 
                value={notificationTarget} 
                onValueChange={setNotificationTarget}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Selecione os destinatários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
                  <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
                  <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
                  <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                  <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
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
                value={notificationMessage}
                onChange={e => setNotificationMessage(e.target.value)}
              />
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSendNotification} disabled={isSending}>
                {isSending ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
