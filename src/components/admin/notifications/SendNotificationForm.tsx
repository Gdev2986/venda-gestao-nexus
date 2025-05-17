import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { NotificationType } from "@/types/enums";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
  type: z.string({
    required_error: "Por favor selecione um tipo de notificação.",
  }),
  userId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SendNotificationFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export function SendNotificationForm({
  userId,
  onSuccess,
}: SendNotificationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "GENERAL",
      userId: userId || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert the enum string to the correct enum value
      const notificationType = data.type as "SUPPORT" | "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "GENERAL" | "SALE";
      
      // Insert notification
      const { error } = await supabase.from('notifications').insert({
        title: data.title,
        message: data.message,
        type: notificationType,
        user_id: data.userId
      });

      if (error) throw error;

      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso."
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar a notificação."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                  <SelectItem value="GENERAL">Geral</SelectItem>
                  <SelectItem value="PAYMENT">Pagamento</SelectItem>
                  <SelectItem value="BALANCE">Saldo</SelectItem>
                  <SelectItem value="MACHINE">Máquina</SelectItem>
                  <SelectItem value="COMMISSION">Comissão</SelectItem>
                  <SelectItem value="SUPPORT">Suporte</SelectItem>
                  <SelectItem value="SYSTEM">Sistema</SelectItem>
                  <SelectItem value="SALE">Venda</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Notificação"
          )}
        </Button>
      </form>
    </Form>
  );
}
