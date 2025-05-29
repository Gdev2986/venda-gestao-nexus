
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
import { CheckCircle, Info } from "lucide-react";

export const SendNotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>(NotificationType.GENERAL);
  const [recipientType, setRecipientType] = useState<"all" | "roles">("all");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ count: number; roles: string[] } | null>(null);

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
    
    if (!title.trim() || !message.trim()) {
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
    setLastResult(null);
    
    try {
      const targetRoles = recipientType === "all" 
        ? ["ADMIN", "CLIENT", "PARTNER", "FINANCIAL", "LOGISTICS"]
        : selectedRoles;
      
      console.log('Attempting to send notification:', { title, message, type, targetRoles });
      
      const insertedCount = await sendNotificationToRoles(title, message, type, targetRoles);
      
      setLastResult({ count: insertedCount, roles: targetRoles });
      
      // Reset form
      setTitle("");
      setMessage("");
      setType(NotificationType.GENERAL);
      setRecipientType("all");
      setSelectedRoles([]);
      
      toast({
        title: "Sucesso",
        description: `Notificação enviada para ${insertedCount} usuário(s) em ${targetRoles.length} função(ões)`,
      });
      
    } catch (error: any) {
      console.error("Error sending notification:", error);
      
      let errorMessage = "Falha ao enviar notificação";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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
    <div className="space-y-4">
      {/* Result display */}
      {lastResult && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Notificação enviada com sucesso!</span>
            </div>
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              <p>• {lastResult.count} usuário(s) notificado(s)</p>
              <p>• Funções: {lastResult.roles.map(role => 
                availableRoles.find(r => r.value === role)?.label || role
              ).join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da notificação"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem *</Label>
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
              <div className="space-y-2 border rounded-md p-3 dark:border-gray-700">
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
                  <div className="mt-2 p-2 bg-muted rounded text-sm dark:bg-gray-800">
                    <strong>Selecionadas:</strong> {selectedRoles.map(role => 
                      availableRoles.find(r => r.value === role)?.label
                    ).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Help text with improved dark mode styling */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Dicas:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• As notificações serão enviadas apenas para usuários ativos</li>
                  <li>• Usuários online receberão notificações em tempo real</li>
                  <li>• Usuários offline receberão quando acessarem o sistema</li>
                  <li>• O sistema possui fallback automático em caso de falha</li>
                </ul>
              </div>
            </div>
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
    </div>
  );
};
