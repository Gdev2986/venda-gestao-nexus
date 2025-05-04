import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { UserSettings } from "@/types";
import { saveSettings, loadSettings } from "@/settings-utils";
import PixKeysManager from "@/components/settings/PixKeysManager";

// Define the SimplifiedPixKey type to match the actual data structure
interface SimplifiedPixKey {
  id: string;
  user_id: string;
  key_type: string;
  key: string;
  owner_name: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bank_name: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  language: z.string().default("pt-BR"),
  timezone: z.string().default("America/Sao_Paulo"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notificationsMarketing: z.boolean().default(true),
  notificationsSecurity: z.boolean().default(true),
  displayShowBalance: z.boolean().default(true),
  displayShowNotifications: z.boolean().default(true),
});

interface SettingsFormValues {
  name: string;
  email: string;
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  notificationsMarketing: boolean;
  notificationsSecurity: boolean;
  displayShowBalance: boolean;
  displayShowNotifications: boolean;
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [initialSettings, setInitialSettings] = useState<UserSettings | null>(null);
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      theme: "system",
      notificationsMarketing: true,
      notificationsSecurity: true,
      displayShowBalance: true,
      displayShowNotifications: true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const loadUserSetting = async () => {
      setLoading(true);
      try {
        const { settings, error } = await loadSettings();
        if (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar configurações",
            description: error,
          });
        }
        if (settings) {
          setInitialSettings(settings);
          form.reset({
            name: settings.name,
            email: settings.email,
            language: settings.language,
            timezone: settings.timezone,
            theme: settings.theme,
            notificationsMarketing: settings.notifications.marketing,
            notificationsSecurity: settings.notifications.security,
            displayShowBalance: settings.display.showBalance,
            displayShowNotifications: settings.display.showNotifications,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar configurações",
          description: "Falha ao carregar as configurações do usuário.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserSetting();
  }, [toast, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setLoading(true);
    try {
      const settings: UserSettings = {
        name: values.name,
        email: values.email,
        language: values.language,
        timezone: values.timezone,
        theme: values.theme,
        notifications: {
          marketing: values.notificationsMarketing,
          security: values.notificationsSecurity,
        },
        display: {
          showBalance: values.displayShowBalance,
          showNotifications: values.displayShowNotifications,
        },
      };

      const { success, error } = await saveSettings(settings);
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "Suas configurações foram salvas com sucesso.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar configurações",
          description: error || "Falha ao salvar as configurações.",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar as configurações.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Conta</CardTitle>
            <CardDescription>
              Gerencie as informações da sua conta e personalize sua experiência.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o nome que será exibido em sua conta.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seuemail@exemplo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este é o seu endereço de e-mail.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">Inglês (Estados Unidos)</SelectItem>
                          <SelectItem value="es-ES">Espanhol (Espanha)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o idioma de sua preferência.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuso Horário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um fuso horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">
                            America/Sao_Paulo
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            America/Los_Angeles
                          </SelectItem>
                          {/* Adicione mais fusos horários conforme necessário */}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione seu fuso horário.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Tema</FormLabel>
                        <FormDescription>
                          Selecione o tema de sua preferência.
                        </FormDescription>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tema" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationsMarketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Notificações de Marketing</FormLabel>
                        <FormDescription>
                          Receba novidades e ofertas especiais.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationsSecurity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Notificações de Segurança</FormLabel>
                        <FormDescription>
                          Seja notificado sobre atividades suspeitas e alertas de segurança.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayShowBalance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Mostrar Saldo</FormLabel>
                        <FormDescription>
                          Exibir o saldo na sua dashboard.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayShowNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Mostrar Notificações</FormLabel>
                        <FormDescription>
                          Exibir notificações na sua dashboard.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
        <PixKeysManager />
      </div>
    </MainLayout>
  );
};

export default Settings;
