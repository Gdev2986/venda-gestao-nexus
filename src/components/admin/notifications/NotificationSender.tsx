
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationType } from "@/services/NotificationService";
import { useNotifications } from "@/hooks/use-notifications";
import { UserRole } from "@/types";

export const NotificationSender = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("GENERAL");
  const [recipientType, setRecipientType] = useState<string>(UserRole.CLIENT);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { sendNotificationToRole } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha o título e a mensagem",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await sendNotificationToRole(
        { title, message, type, data: {} },
        recipientType as UserRole
      );
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso"
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      setType("GENERAL");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a notificação",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">Título</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da notificação"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="type">Tipo de notificação</label>
              <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">Geral</SelectItem>
                  <SelectItem value="MACHINE">Máquina</SelectItem>
                  <SelectItem value="PAYMENT">Pagamento</SelectItem>
                  <SelectItem value="SALE">Venda</SelectItem>
                  <SelectItem value="SUPPORT">Suporte</SelectItem>
                  <SelectItem value="SYSTEM">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="recipient">Destinatários</label>
            <Select value={recipientType} onValueChange={setRecipientType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
                <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
                <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="message">Mensagem</label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Conteúdo da notificação"
              rows={5}
            />
          </div>
          
          <Button type="submit" disabled={isSending}>
            {isSending ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
