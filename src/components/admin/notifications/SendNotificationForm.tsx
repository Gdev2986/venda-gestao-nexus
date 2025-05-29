
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/contexts/notifications/NotificationsContext";

export const SendNotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>(NotificationType.GENERAL);
  const [recipientType, setRecipientType] = useState<"all" | "roles">("all");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const { toast } = useToast();
  const { sendNotificationToRoles } = useNotifications();

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

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
      const targetRoles = recipientType === "all" 
        ? ["ADMIN", "CLIENT", "PARTNER", "FINANCIAL", "LOGISTICS"]
        : selectedRoles;
      
      await sendNotificationToRoles(title, message, type, targetRoles);
      
      // Reset form
      setTitle("");
      setMessage("");
      setType(NotificationType.GENERAL);
      setRecipientType("all");
      setSelectedRoles([]);
      
      toast({
        title: "Sucesso",
        description: `Notificação enviada para ${targetRoles.length} função(ões)`,
      });
      
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação. Verifique se as funções do banco de dados estão configuradas corretamente.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const availableRoles = [
    { value: "ADMIN", label: "Admin" },
    { value: "CLIENT", label: "Cliente" },
    { value: "PARTNER", label: "Parceiro" },
    { value: "FINANCIAL", label: "Financeiro" },
    { value: "LOGISTICS", label: "Logística" },
  ];

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da notificação"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem</Label>
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
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as NotificationType)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
                <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                <SelectItem value={NotificationType.MACHINE}>Máquinas</SelectItem>
                <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                <SelectItem value={NotificationType.LOGISTICS}>Logística</SelectItem>
                <SelectItem value={NotificationType.ADMIN_NOTIFICATION}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recipientType">Destinatários</Label>
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
                {availableRoles.map((role) => (
                  <div key={role.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`role-${role.value}`}
                      checked={selectedRoles.includes(role.value)}
                      onCheckedChange={() => handleRoleToggle(role.value)}
                    />
                    <Label htmlFor={`role-${role.value}`}>{role.label}</Label>
                  </div>
                ))}
              </div>
              {selectedRoles.length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Selecionadas:</strong> {selectedRoles.map(role => 
                    availableRoles.find(r => r.value === role)?.label
                  ).join(", ")}
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            type="submit" 
            disabled={sending} 
            className="w-full"
          >
            {sending ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
