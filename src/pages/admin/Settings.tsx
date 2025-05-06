
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { UserRole } from "@/types";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAudience, setNotificationAudience] = useState("all");
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch sent notifications
  useEffect(() => {
    const fetchSentNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("data->>'is_system_message'", 'true')
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setSentNotifications(data || []);
    };

    fetchSentNotifications();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profileData) {
          setName(profileData.name || "");
          setEmail(profileData.email || "");
          setPhone(profileData.phone || "");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título e a mensagem da notificação.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Fetch appropriate users based on audience selection
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id, role")
        .in(
          "role", 
          notificationAudience === "all" 
            ? [UserRole.CLIENT, UserRole.PARTNER, UserRole.ADMIN, UserRole.FINANCIAL, UserRole.LOGISTICS] 
            : notificationAudience === "clients" 
              ? [UserRole.CLIENT]
              : [UserRole.PARTNER]
        );

      if (usersError) throw usersError;

      // Create notification objects for each user
      const notifications = users.map((user) => ({
        user_id: user.id,
        title: notificationTitle,
        message: notificationMessage,
        type: "SYSTEM",
        data: { sent_by: "ADMIN", is_system_message: true }
      }));

      // Insert notifications
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (insertError) throw insertError;

      // Reset form and show success
      setNotificationTitle("");
      setNotificationMessage("");
      toast({
        title: "Sucesso",
        description: "Notificações enviadas com sucesso.",
      });

      // Refresh sent notifications list
      const { data: updatedNotifications } = await supabase
        .from("notifications")
        .select("*")
        .eq("data->>'is_system_message'", 'true')
        .order("created_at", { ascending: false })
        .limit(10);

      setSentNotifications(updatedNotifications || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) throw new Error("Usuário não encontrado");

      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          email,
          phone,
          updated_at: new Date().toISOString()
        })
        .eq("id", userData.user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Seu perfil foi atualizado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader 
        title="Configurações" 
        description="Gerencie configurações do sistema e do seu perfil"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe 
                src="/admin/users/management"
                title="User Management"
                className="w-full h-[70vh] border rounded-md"
                style={{ backgroundColor: 'white' }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notifications-enabled"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
                <Label htmlFor="notifications-enabled">Receber notificações do sistema</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enviar Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-audience">Destinatários</Label>
                <Select value={notificationAudience} onValueChange={setNotificationAudience}>
                  <SelectTrigger id="notification-audience">
                    <SelectValue placeholder="Selecione os destinatários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    <SelectItem value="clients">Apenas clientes</SelectItem>
                    <SelectItem value="partners">Apenas parceiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-title">Título</Label>
                <Input 
                  id="notification-title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Título da notificação"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-message">Mensagem</Label>
                <Textarea 
                  id="notification-message"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Mensagem para os usuários"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSendNotification} 
                disabled={isSending || !notificationTitle || !notificationMessage}
              >
                {isSending ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Notificações Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              {sentNotifications.length > 0 ? (
                <div className="space-y-4">
                  {sentNotifications.map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{notification.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma notificação enviada recentemente.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Settings Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Seu telefone"
                />
              </div>
              
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isUpdating || !name || !email}
              >
                {isUpdating ? "Atualizando..." : "Atualizar Dados"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input 
                  id="current-password"
                  type="password"
                  placeholder="Sua senha atual"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input 
                  id="new-password"
                  type="password"
                  placeholder="Nova senha"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme a nova senha"
                />
              </div>
              
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AdminSettings;
