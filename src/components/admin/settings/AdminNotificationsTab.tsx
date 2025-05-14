
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNotificationDto, NotificationService } from "@/services/NotificationService";
import { UserRole } from "@/types";

// Form schema validation
const notificationFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  message: z.string().min(1, "Mensagem é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  role: z.string().min(1, "Função é obrigatória"),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export const AdminNotificationsTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "GENERAL",
      role: "CLIENT",
    },
  });

  // Handle form submission
  const onSubmit = async (data: NotificationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format notification data
      const notification: CreateNotificationDto = {
        title: data.title,
        message: data.message,
        type: data.type as any,
        data: {},
      };
      
      // Send notification to selected role
      await NotificationService.sendNotificationToRole(notification, data.role as UserRole);
      
      toast({
        title: "Notificação enviada",
        description: `Notificação enviada para todos os usuários com a função ${data.role}`,
      });
      
      // Reset form after submission
      form.reset();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a notificação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações do Sistema</CardTitle>
        <CardDescription>Envie notificações para diferentes grupos de usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da notificação" {...field} />
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
                      placeholder="Digite a mensagem da notificação" 
                      className="min-h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">Geral</SelectItem>
                        <SelectItem value="PAYMENT">Pagamento</SelectItem>
                        <SelectItem value="MACHINE">Máquinas</SelectItem>
                        <SelectItem value="SYSTEM">Sistema</SelectItem>
                        <SelectItem value="SUPPORT">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CLIENT">Todos os Clientes</SelectItem>
                        <SelectItem value="PARTNER">Todos os Parceiros</SelectItem>
                        <SelectItem value="ADMIN">Todos os Administradores</SelectItem>
                        <SelectItem value="FINANCIAL">Equipe Financeira</SelectItem>
                        <SelectItem value="LOGISTICS">Equipe de Logística</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A notificação será enviada para todos os usuários com esta função
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Notificação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
