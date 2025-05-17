import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NotificationType } from "@/types/enums";

const notificationFormSchema = z.object({
  title: z.string().min(3, {
    message: "Título deve ter pelo menos 3 caracteres.",
  }),
  message: z.string().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres.",
  }),
  targetType: z.enum(["all", "specific"]),
  targetId: z.string().optional(),
  type: z.nativeEnum(NotificationType)
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export function SendNotification() {
  const { toast } = useToast();
  const [clients, setClients] = useState<{ id: string; business_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  // Load clients for the dropdown when selecting specific client
  const fetchClients = async () => {
    if (clients.length > 0) return; // Already loaded
    
    setLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, business_name')
        .order('business_name', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes."
      });
    } finally {
      setLoadingClients(false);
    }
  };

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      targetType: "all",
      targetId: "",
      type: NotificationType.SYSTEM
    },
  });

  // Watch for changes to targetType to fetch clients when needed
  const targetType = form.watch("targetType");
  if (targetType === "specific" && clients.length === 0 && !loadingClients) {
    fetchClients();
  }

  const onSubmit = async (data: NotificationFormValues) => {
    setIsLoading(true);
    
    try {
      if (data.targetType === "all") {
        // Send to all clients
        // Get all user IDs
        const { data: userAccess, error: userError } = await supabase
          .from('user_client_access')
          .select('user_id');
          
        if (userError) throw userError;
        
        if (userAccess && userAccess.length > 0) {
          // Create notifications for each user
          const notifications = userAccess.map(access => ({
            user_id: access.user_id,
            title: data.title,
            message: data.message,
            type: data.type as unknown as string, // Cast to string to work with Supabase
            data: { global: true }
          }));
          
          const { error } = await supabase
            .from('notifications')
            .insert(notifications.map(n => ({
              user_id: n.user_id,
              title: n.title,
              message: n.message,
              type: n.type,
              data: n.data
            })));
          
          if (error) throw error;
        }
      } else if (data.targetType === "specific" && data.targetId) {
        // Find user_id linked to this client
        const { data: accessData, error: accessError } = await supabase
          .from('user_client_access')
          .select('user_id')
          .eq('client_id', data.targetId)
          .single();
          
        if (accessError) throw accessError;
        
        // Then insert the notification for this specific client's user
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: accessData.user_id,
            title: data.title,
            message: data.message,
            type: data.type as unknown as string, // Cast to string to work with Supabase
            data: { clientId: data.targetId }
          });
        
        if (error) throw error;
      }
      
      toast({
        title: "Notificação enviada",
        description: "Sua notificação foi enviada com sucesso."
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação."
      });
    } finally {
      setIsLoading(false);
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Notificação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                  <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
                  <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                  <SelectItem value={NotificationType.SALE}>Venda</SelectItem>
                  <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                </SelectContent>
              </Select>
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
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="targetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enviar para</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  <SelectItem value="specific">Cliente específico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {targetType === "specific" && (
          <FormField
            control={form.control}
            name="targetId"
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
                    {loadingClients ? (
                      <SelectItem value="loading" disabled>Carregando clientes...</SelectItem>
                    ) : (
                      clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
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
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar notificação"}
        </Button>
      </form>
    </Form>
  );
}
