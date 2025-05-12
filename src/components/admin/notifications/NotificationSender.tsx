
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/services/NotificationService";
import { UserRole } from "@/types";

const notificationSchema = z.object({
  title: z.string().min(3, { message: "O título precisa ter pelo menos 3 caracteres" }),
  message: z.string().min(10, { message: "A mensagem precisa ter pelo menos 10 caracteres" }),
  targetRole: z.string(),
  type: z.string(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationSender() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendNotificationToRole } = useNotifications();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      targetRole: "ALL",
      type: "GENERAL",
    },
  });

  const onSubmit = async (values: NotificationFormValues) => {
    setIsSubmitting(true);
    try {
      // Handle "ALL" role specially
      if (values.targetRole === "ALL") {
        // Send to each role separately
        const roles = ["ADMIN", "CLIENT", "PARTNER", "FINANCIAL", "LOGISTICS"];
        await Promise.all(
          roles.map(role => 
            sendNotificationToRole(
              {
                title: values.title,
                message: values.message,
                type: values.type as NotificationType,
                data: {},
              },
              role
            )
          )
        );
      } else {
        // Send to specific role
        await sendNotificationToRole(
          {
            title: values.title,
            message: values.message,
            type: values.type as NotificationType,
            data: {},
          },
          values.targetRole
        );
      }
      
      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a notificação",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
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
                      placeholder="Detalhes da notificação" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função de destino</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Todos os usuários</SelectItem>
                        <SelectItem value="ADMIN">Administradores</SelectItem>
                        <SelectItem value="CLIENT">Clientes</SelectItem>
                        <SelectItem value="PARTNER">Parceiros</SelectItem>
                        <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                        <SelectItem value="LOGISTICS">Logística</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">Geral</SelectItem>
                        <SelectItem value="SYSTEM">Sistema</SelectItem>
                        <SelectItem value="SALE">Vendas</SelectItem>
                        <SelectItem value="PAYMENT">Pagamento</SelectItem>
                        <SelectItem value="MACHINE">Máquina</SelectItem>
                        <SelectItem value="SUPPORT">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Notificação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
