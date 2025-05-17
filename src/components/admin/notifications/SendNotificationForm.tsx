import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { NotificationType, UserRole } from "@/types/enums";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
  type: z.string({
    required_error: "Selecione um tipo de notificação.",
  }),
  recipient_type: z.string({
    required_error: "Selecione um tipo de destinatário.",
  }),
  recipient_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SendNotificationFormProps {
  onSuccess?: () => void;
}

export function SendNotificationForm({ onSuccess }: SendNotificationFormProps) {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { partners, isLoading: isLoadingPartners } = usePartners();
  const { sendNotification, isLoading: isSending } = useNotifications();
  const [recipientType, setRecipientType] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.GENERAL,
      recipient_type: "",
      recipient_id: "",
    },
  });

  // Watch recipient_type to update UI
  const watchedRecipientType = form.watch("recipient_type");

  // Update local state when form value changes
  useEffect(() => {
    setRecipientType(watchedRecipientType);
  }, [watchedRecipientType]);

  // Reset recipient_id when recipient_type changes
  useEffect(() => {
    form.setValue("recipient_id", "");
  }, [recipientType, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await sendNotification({
        title: data.title,
        message: data.message,
        type: data.type as NotificationType,
        recipient_type: data.recipient_type as UserRole,
        recipient_id: data.recipient_id || undefined,
      });

      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a notificação. Tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="Digite a mensagem da notificação"
                  className="min-h-[120px]"
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
                    <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                    <SelectItem value={NotificationType.BALANCE}>Saldo</SelectItem>
                    <SelectItem value={NotificationType.MACHINE}>Máquina</SelectItem>
                    <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                    <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipient_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatário</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de destinatário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.CLIENT}>Todos os Clientes</SelectItem>
                    <SelectItem value={UserRole.PARTNER}>Todos os Parceiros</SelectItem>
                    <SelectItem value="specific_client">Cliente Específico</SelectItem>
                    <SelectItem value="specific_partner">Parceiro Específico</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {recipientType === "specific_client" && (
          <FormField
            control={form.control}
            name="recipient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingClients ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando clientes...</span>
                      </div>
                    ) : (
                      clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name || client.contact_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {recipientType === "specific_partner" && (
          <FormField
            control={form.control}
            name="recipient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parceiro</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um parceiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingPartners ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando parceiros...</span>
                      </div>
                    ) : (
                      partners?.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.company_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSending}>
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
