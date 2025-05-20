
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { NotificationType } from "@/types/notification.types";
import { Notification } from "@/types/notification.types";
import { UserRole } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NotificationContentFields } from "./NotificationContentFields";
import { NotificationTypeSelector } from "./NotificationTypeSelector";
import { RecipientSelector } from "./RecipientSelector";

interface SendNotificationFormProps {
  onSendNotification: (notification: Partial<Notification>) => Promise<any>;
}

export const SendNotificationForm = ({ onSendNotification }: SendNotificationFormProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM);
  const [recipientType, setRecipientType] = useState<"all" | "roles">("all");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [sending, setSending] = useState(false);
  const [isTestNotification, setIsTestNotification] = useState(false);

  const { toast } = useToast();

  const handleRoleToggle = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

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

    // Validate that at least one role is selected if using role-based targeting
    if (recipientType === "roles" && selectedRoles.length === 0) {
      toast({
        title: "Nenhuma função selecionada",
        description: "Selecione pelo menos uma função para enviar a notificação",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const notificationData: Partial<Notification> = {
        title,
        message,
        type,
        data: {
          isTest: isTestNotification
        }
      };

      // Add recipient roles if not sending to all
      if (recipientType === "roles") {
        notificationData.recipient_roles = selectedRoles as unknown as string[];
      }
      
      await onSendNotification(notificationData);
      
      setTitle("");
      setMessage("");
      setType(NotificationType.SYSTEM);
      setRecipientType("all");
      setSelectedRoles([]);
      setIsTestNotification(false);
      
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
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <NotificationContentFields 
            title={title}
            message={message}
            onTitleChange={setTitle}
            onMessageChange={setMessage}
          />

          <NotificationTypeSelector 
            type={type}
            onTypeChange={setType}
          />

          <RecipientSelector
            recipientType={recipientType}
            selectedRoles={selectedRoles}
            onRecipientTypeChange={setRecipientType}
            onRoleToggle={handleRoleToggle}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="test-notification" 
              checked={isTestNotification}
              onCheckedChange={(checked) => setIsTestNotification(checked === true)}
            />
            <Label htmlFor="test-notification">Notificação de teste</Label>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button 
            type="submit" 
            disabled={sending} 
            className="w-full sm:w-auto"
          >
            {sending ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
