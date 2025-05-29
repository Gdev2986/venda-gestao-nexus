
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
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { NotificationType } from "@/types/notification.types";
import { Notification } from "@/types/notification.types";
import { UserRole } from "@/types";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
        notificationData.data = {
          ...notificationData.data,
          recipient_roles: selectedRoles as unknown as string[]
        };
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
          <div>
            <Label htmlFor="title">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da notificação"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">
              Mensagem
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Conteúdo da notificação"
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">
              Tipo
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as NotificationType)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                <SelectItem value={NotificationType.MACHINE}>Máquinas</SelectItem>
                <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
                <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                <SelectItem value={NotificationType.SALE}>Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recipientType">
              Destinatários
            </Label>
            <Select
              value={recipientType}
              onValueChange={(value: "all" | "roles") => setRecipientType(value)}
            >
              <SelectTrigger id="recipientType">
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="roles">Funções específicas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === "roles" && (
            <div className="space-y-2 border rounded-md p-3">
              <Label className="block mb-2">Selecione as funções:</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="role-admin" 
                      checked={selectedRoles.includes(UserRole.ADMIN)}
                      onCheckedChange={() => handleRoleToggle(UserRole.ADMIN)}
                    />
                    <Label htmlFor="role-admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="role-client" 
                      checked={selectedRoles.includes(UserRole.CLIENT)}
                      onCheckedChange={() => handleRoleToggle(UserRole.CLIENT)}
                    />
                    <Label htmlFor="role-client">Cliente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="role-financial" 
                      checked={selectedRoles.includes(UserRole.FINANCIAL)}
                      onCheckedChange={() => handleRoleToggle(UserRole.FINANCIAL)}
                    />
                    <Label htmlFor="role-financial">Financeiro</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="role-partner" 
                      checked={selectedRoles.includes(UserRole.PARTNER)}
                      onCheckedChange={() => handleRoleToggle(UserRole.PARTNER)}
                    />
                    <Label htmlFor="role-partner">Parceiro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="role-logistics" 
                      checked={selectedRoles.includes(UserRole.LOGISTICS)}
                      onCheckedChange={() => handleRoleToggle(UserRole.LOGISTICS)}
                    />
                    <Label htmlFor="role-logistics">Logística</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
