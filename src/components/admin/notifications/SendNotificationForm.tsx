
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, NotificationType } from "@/types/enums";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
  type: z.nativeEnum(NotificationType),
  role: z.enum([
    UserRole.ADMIN,
    UserRole.FINANCIAL,
    UserRole.PARTNER,
    UserRole.LOGISTICS,
    UserRole.CLIENT,
    UserRole.MANAGER,
    UserRole.FINANCE,
    UserRole.SUPPORT,
    UserRole.USER
  ]),
});

interface SendNotificationFormProps {
  onClose: () => void;
}

const SendNotificationForm = ({ onClose }: SendNotificationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.GENERAL,
      role: UserRole.CLIENT,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Get users with the specified role
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", values.role);

      if (usersError) {
        throw new Error(usersError.message);
      }

      if (users && users.length > 0) {
        // Insert a notification for each user with the specified role
        const notificationsToInsert = users.map(user => ({
          user_id: user.id,
          title: values.title,
          message: values.message,
          type: values.type,
          data: { role: values.role }
        }));

        const { error } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);

        if (error) {
          throw new Error(error.message);
        }
      }

      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
                      placeholder="Mensagem da notificação"
                      className="resize-none"
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(NotificationType).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
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
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendNotificationForm;
