
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
import { Card } from "@/components/ui/card";
import { NotificationType } from "@/types/enums";
import { Notification } from "@/types/notification.types";

export const SendNotificationForm = ({
  onSendNotification,
}: {
  onSendNotification: (notification: Partial<Notification>) => Promise<any>;
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<string>(NotificationType.SYSTEM);
  const [recipients, setRecipients] = useState<"all" | "admins" | "clients">(
    "all"
  );
  const [sending, setSending] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      await onSendNotification({
        title,
        message,
        type: type as NotificationType,
        recipients
      });
      
      setTitle("");
      setMessage("");
      setType(NotificationType.ADMIN_NOTIFICATION);
      setRecipients("all");
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a notificação",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Título
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da notificação"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="message">
            Mensagem
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Conteúdo da notificação"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="type">
            Tipo
          </label>
          <Select
            value={type}
            onValueChange={setType}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
              <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
              <SelectItem value={NotificationType.MACHINE}>Máquinas</SelectItem>
              <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
              <SelectItem value={NotificationType.ADMIN_NOTIFICATION}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="recipients">
            Destinatários
          </label>
          <Select
            value={recipients}
            onValueChange={(value: "all" | "admins" | "clients") =>
              setRecipients(value)
            }
          >
            <SelectTrigger id="recipients">
              <SelectValue placeholder="Selecione os destinatários" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admins">Apenas Administradores</SelectItem>
              <SelectItem value="clients">Apenas Clientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar Notificação"}
        </Button>
      </form>
    </Card>
  );
};
