
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole, NotificationType } from "@/types/enums";

export const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState<string>("ALL");
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.GENERAL);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios."
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Here would be the API call to send the notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso."
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      setTargetRole("ALL");
      setNotificationType(NotificationType.GENERAL);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar a notificação. Tente novamente."
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Perfil alvo</label>
          <Select value={targetRole} onValueChange={setTargetRole}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os usuários</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
              <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
              <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de notificação</label>
          <Select 
            value={notificationType} 
            onValueChange={(value) => setNotificationType(value as NotificationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
              <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
              <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
              <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
              <SelectItem value={NotificationType.BALANCE}>Saldo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
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
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Mensagem
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensagem da notificação"
            required
            rows={4}
          />
        </div>
      </div>
      
      <Button type="submit" disabled={isSending}>
        {isSending ? "Enviando..." : "Enviar notificação"}
      </Button>
    </form>
  );
};
