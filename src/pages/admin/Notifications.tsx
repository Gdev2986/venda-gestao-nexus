
import { useState, useEffect, FormEvent } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notificationService, NotificationType } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminNotifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<string>("all");
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [allUserIds, setAllUserIds] = useState<string[]>([]);
  const [adminUserIds, setAdminUserIds] = useState<string[]>([]);
  const [clientUserIds, setClientUserIds] = useState<string[]>([]);
  const [partnerUserIds, setPartnerUserIds] = useState<string[]>([]);
  const [financialUserIds, setFinancialUserIds] = useState<string[]>([]);
  const [logisticsUserIds, setLogisticsUserIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        // Fetch all users
        const { data: allUsers, error: allError } = await supabase
          .from("profiles")
          .select("id");
        
        if (allError) throw allError;
        setAllUserIds(allUsers.map(user => user.id));
        
        // Fetch users by role
        const { data: adminUsers, error: adminError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "ADMIN");
          
        if (adminError) throw adminError;
        setAdminUserIds(adminUsers.map(user => user.id));
        
        const { data: clientUsers, error: clientError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "CLIENT");
          
        if (clientError) throw clientError;
        setClientUserIds(clientUsers.map(user => user.id));
        
        const { data: partnerUsers, error: partnerError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "PARTNER");
          
        if (partnerError) throw partnerError;
        setPartnerUserIds(partnerUsers.map(user => user.id));
        
        const { data: financialUsers, error: financialError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "FINANCIAL");
          
        if (financialError) throw financialError;
        setFinancialUserIds(financialUsers.map(user => user.id));
        
        const { data: logisticsUsers, error: logisticsError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "LOGISTICS");
          
        if (logisticsError) throw logisticsError;
        setLogisticsUserIds(logisticsUsers.map(user => user.id));
        
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários.",
          variant: "destructive",
        });
      }
    };

    fetchUsersByRole();
  }, [toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast({
        title: "Erro",
        description: "O título e a mensagem são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      let userIds: string[] = [];
      
      switch (target) {
        case "all":
          userIds = allUserIds;
          break;
        case "ADMIN":
          userIds = adminUserIds;
          break;
        case "CLIENT":
          userIds = clientUserIds;
          break;
        case "PARTNER":
          userIds = partnerUserIds;
          break;
        case "FINANCIAL":
          userIds = financialUserIds;
          break;
        case "LOGISTICS":
          userIds = logisticsUserIds;
          break;
      }
      
      if (userIds.length === 0) {
        toast({
          title: "Aviso",
          description: "Não há usuários no grupo selecionado.",
          variant: "default",
        });
        setIsSending(false);
        return;
      }
      
      const result = await notificationService.createBulkNotifications({
        user_ids: userIds,
        title,
        message,
        type: "SYSTEM" as NotificationType,
        data: { sentBy: "admin", sentAt: new Date().toISOString() },
      });
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Notificação enviada para ${userIds.length} usuários.`,
        });
        setTitle("");
        setMessage("");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar a notificação.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Gerenciar e enviar notificações para os usuários do sistema"
      />

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">Nova Notificação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Destinatários</Label>
                  <Select
                    value={target}
                    onValueChange={setTarget}
                  >
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="ADMIN">Administradores</SelectItem>
                      <SelectItem value="CLIENT">Clientes</SelectItem>
                      <SelectItem value="PARTNER">Parceiros</SelectItem>
                      <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                      <SelectItem value="LOGISTICS">Logística</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da notificação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite o conteúdo da notificação"
                    rows={5}
                  />
                </div>

                <Button type="submit" disabled={isSending}>
                  {isSending ? "Enviando..." : "Enviar Notificação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <p>Histórico de notificações enviadas</p>
              {/* Implement notification history here */}
              <div className="text-center py-8 text-muted-foreground">
                O histórico de notificações será implementado em breve.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="pt-6">
              <p>Templates de notificações</p>
              {/* Implement notification templates here */}
              <div className="text-center py-8 text-muted-foreground">
                Os templates de notificações serão implementados em breve.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
