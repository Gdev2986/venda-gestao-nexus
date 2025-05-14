
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  role: z.string().optional(),
  userId: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export const NotificationSender = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "GENERAL",
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
      
      // Determine if sending to role or specific user
      if (data.role) {
        await NotificationService.sendNotificationToRole(notification, data.role as UserRole);
        toast({
          title: "Notificação enviada",
          description: `Notificação enviada para todos os usuários com a função ${data.role}`,
        });
      } else if (data.userId) {
        await NotificationService.sendNotificationToUser(notification, data.userId);
        toast({
          title: "Notificação enviada",
          description: "Notificação enviada para o usuário específico",
        });
      }
      
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
        <CardTitle>Enviar Notificação</CardTitle>
        <CardDescription>Envie notificações para usuários específicos ou grupos</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="role" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="role">Por Função</TabsTrigger>
            <TabsTrigger value="user">Para Usuário</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Common fields */}
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
              
              {/* Role-specific fields */}
              <TabsContent value="role">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CLIENT">Clientes</SelectItem>
                          <SelectItem value="PARTNER">Parceiros</SelectItem>
                          <SelectItem value="ADMIN">Administradores</SelectItem>
                          <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                          <SelectItem value="LOGISTICS">Logística</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Notificação será enviada para todos os usuários com esta função
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* User-specific fields */}
              <TabsContent value="user">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o ID do usuário" {...field} />
                      </FormControl>
                      <FormDescription>
                        Notificação será enviada apenas para este usuário específico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};
