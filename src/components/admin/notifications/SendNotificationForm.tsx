import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/types";

const formSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  message: z.string().min(1, "Mensagem é obrigatória").max(500, "Mensagem muito longa"),
  type: z.enum([
    "PAYMENT",
    "BALANCE",
    "MACHINE",
    "COMMISSION",
    "SYSTEM",
    "GENERAL",
    "SALE",
    "SUPPORT",
  ]),
});

type FormValues = z.infer<typeof formSchema>;

export function SendNotificationForm() {
  const { toast } = useToast();
  const { sendNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      title: "",
      message: "",
      type: "GENERAL",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      await sendNotification(
        data.userId,
        data.title,
        data.message,
        data.type as NotificationType,
      );
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a notificação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Usuário</FormLabel>
              <FormControl>
                <Input placeholder="ID do usuário" {...field} />
              </FormControl>
              <FormDescription>
                ID do usuário que receberá a notificação
              </FormDescription>
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
                    <SelectValue placeholder="Selecione o tipo de notificação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PAYMENT">Pagamento</SelectItem>
                  <SelectItem value="BALANCE">Saldo</SelectItem>
                  <SelectItem value="MACHINE">Maquininha</SelectItem>
                  <SelectItem value="COMMISSION">Comissão</SelectItem>
                  <SelectItem value="SYSTEM">Sistema</SelectItem>
                  <SelectItem value="GENERAL">Geral</SelectItem>
                  <SelectItem value="SALE">Venda</SelectItem>
                  <SelectItem value="SUPPORT">Suporte</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Notificação"}
        </Button>
      </form>
    </Form>
  );
}
