
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NotificationType, UserRole } from "@/types";
import { useNotifications } from "@/hooks/use-notifications";

export function AdminNotificationsTab() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
  const { toast } = useToast();
  const { createNotification, sendNotificationToRole } = useNotifications();

  const handleSendNotification = async () => {
    if (!title || !message || !type || !selectedRole) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    try {
      await sendNotificationToRole(title, message, type, selectedRole);
      
      toast({
        title: "Notificação enviada",
        description: `A notificação foi enviada para usuários com a função ${selectedRole}.`,
      });
      
      // Limpar formulário
      setTitle("");
      setMessage("");
      setType(NotificationType.SYSTEM);
      setSelectedRole(UserRole.CLIENT);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação. Tente novamente.",
      });
    }
  };

  const handleSendTestNotification = async () => {
    try {
      await createNotification(
        "Notificação de teste",
        "Esta é uma notificação de teste enviada pelo administrador.",
        NotificationType.SYSTEM
      );
      
      toast({
        title: "Notificação de teste enviada",
        description: "A notificação de teste foi enviada com sucesso.",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação de teste",
        description: "Não foi possível enviar a notificação de teste.",
      });
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Enviar Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="notification-title" className="block text-sm font-medium mb-1">
                Título
              </label>
              <Input
                id="notification-title"
                placeholder="Título da notificação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="notification-message" className="block text-sm font-medium mb-1">
                Mensagem
              </label>
              <Textarea
                id="notification-message"
                placeholder="Conteúdo da notificação"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="notification-type" className="block text-sm font-medium mb-1">
                  Tipo de Notificação
                </label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as NotificationType)}
                >
                  <SelectTrigger id="notification-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                    <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                    <SelectItem value={NotificationType.MACHINE}>Máquina</SelectItem>
                    <SelectItem value={NotificationType.BALANCE}>Saldo</SelectItem>
                    <SelectItem value={NotificationType.COMMISSION}>Comissão</SelectItem>
                    <SelectItem value={NotificationType.SALE}>Venda</SelectItem>
                    <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="notification-role" className="block text-sm font-medium mb-1">
                  Função do Destinatário
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger id="notification-role">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
                    <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
                    <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                    <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Gerentes</SelectItem>
                    <SelectItem value={UserRole.SUPPORT}>Suporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleSendTestNotification}>
                Enviar Teste
              </Button>
              <Button onClick={handleSendNotification}>
                Enviar Notificação
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Configure como e quando as notificações são enviadas para os usuários do sistema.
            </p>
            
            {/* Aqui você pode adicionar mais configurações de notificações no futuro */}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
