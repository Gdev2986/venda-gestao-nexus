
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// Component for managing users
const UserManagement = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Visualize e gerencie todos os usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Lista de Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Altere funções de usuários ou ative/desative contas
              </p>
            </div>
            <Button variant="outline">Adicionar Usuário</Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <iframe src="/admin/users/management" className="w-full h-[600px] border-none"></iframe>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for notifications
const NotificationManagement = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<{
    title: string;
    message: string;
    audience: string;
  }>({
    resolver: zodResolver(
      z.object({
        title: z.string().min(1, "Título é obrigatório"),
        message: z.string().min(1, "Mensagem é obrigatória"),
        audience: z.string().min(1, "Selecione o público"),
      })
    ),
    defaultValues: {
      title: "",
      message: "",
      audience: "all",
    },
  });

  useEffect(() => {
    fetchSentNotifications();
  }, []);

  const fetchSentNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setSentNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Erro ao carregar notificações",
        description: "Não foi possível carregar o histórico de notificações.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: { title: string; message: string; audience: string }) => {
    setLoading(true);
    try {
      // Format the audience for the query
      let userFilter = {};
      if (values.audience === "clients") {
        userFilter = { role: UserRole.CLIENT };
      } else if (values.audience === "partners") {
        userFilter = { role: UserRole.PARTNER };
      }
      
      // Get users to send notification to
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .match(userFilter);
      
      if (usersError) throw usersError;
      
      if (users && users.length > 0) {
        // Prepare notifications for batch insert
        const notifications = users.map(user => ({
          user_id: user.id,
          title: values.title,
          message: values.message,
          type: 'ADMIN',
          data: { sent_by: "admin" }
        }));
        
        // Insert notifications in batches of 100 (Supabase limit)
        for (let i = 0; i < notifications.length; i += 100) {
          const batch = notifications.slice(i, i + 100);
          const { error } = await supabase
            .from('notifications')
            .insert(batch);
          
          if (error) throw error;
        }
        
        toast({
          title: "Notificações enviadas",
          description: `Enviado para ${users.length} usuários.`,
        });
        
        form.reset();
        fetchSentNotifications();
      } else {
        toast({
          title: "Nenhum usuário encontrado",
          description: "Não há usuários para enviar a notificação.",
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Erro ao enviar notificações",
        description: "Não foi possível enviar as notificações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerenciamento de Notificações</CardTitle>
        <CardDescription>
          Configure notificações e envie mensagens para usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Receber Notificações</h3>
            <p className="text-sm text-muted-foreground">
              Ative ou desative o recebimento de notificações do sistema
            </p>
          </div>
          <Switch
            checked={notificationEnabled}
            onCheckedChange={setNotificationEnabled}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Enviar Notificação</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o público" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos os usuários</SelectItem>
                        <SelectItem value="clients">Apenas clientes</SelectItem>
                        <SelectItem value="partners">Apenas parceiros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da notificação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conteúdo da notificação"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Histórico de Notificações</h3>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Título</th>
                    <th className="p-2 text-left font-medium">Mensagem</th>
                    <th className="p-2 text-left font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {sentNotifications.length > 0 ? (
                    sentNotifications.map((notification) => (
                      <tr key={notification.id} className="border-b">
                        <td className="p-2">{notification.title}</td>
                        <td className="p-2">{notification.message}</td>
                        <td className="p-2">
                          {new Date(notification.created_at).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-2 text-center">
                        Nenhuma notificação enviada recentemente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for personal settings
const PersonalSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<{
    name: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("E-mail inválido"),
        phone: z.string().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
      }).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
      }).refine(data => !data.newPassword || data.currentPassword, {
        message: "Senha atual é obrigatória para alterar a senha",
        path: ["currentPassword"],
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        form.reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          phone: values.phone,
        })
        .eq('id', user?.id);
      
      if (profileError) throw profileError;
      
      // Update password if provided
      if (values.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: values.newPassword,
        });
        
        if (passwordError) throw passwordError;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      // Reset password fields
      form.setValue('currentPassword', '');
      form.setValue('newPassword', '');
      form.setValue('confirmPassword', '');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e de segurança
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Pessoais</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Alterar Senha</h3>
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main Settings Page
const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas configurações, usuários e notificações do sistema
          </p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="personal">Configurações Pessoais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <NotificationManagement />
          </TabsContent>
          
          <TabsContent value="personal" className="mt-6">
            <PersonalSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
