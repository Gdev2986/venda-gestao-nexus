
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { NotificationType } from "@/types";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").max(100, "O título não pode exceder 100 caracteres"),
  target: z.string(),
  message: z.string().min(5, "A mensagem deve ter pelo menos 5 caracteres").max(500, "A mensagem não pode exceder 500 caracteres"),
  type: z.nativeEnum(NotificationType),
});

type FormValues = z.infer<typeof formSchema>;

const SendNotificationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      target: "all",
      message: "",
      type: NotificationType.GENERAL,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Buscar os usuários alvo com base na seleção
      let userIds: string[] = [];
      
      if (data.target === "all") {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id');
        
        if (error) throw error;
        userIds = users.map(user => user.id);
        
      } else {
        // Filtrar por tipo específico de usuário - fix the TypeScript error by using 'eq' with string
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', data.target as string); // Cast to string to fix the type error
        
        if (error) throw error;
        userIds = users.map(user => user.id);
      }
      
      // Preparar as notificações para todos os usuários alvo
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: data.title,
        message: data.message,
        type: data.type,
        is_read: false,
      }));
      
      // Enviar as notificações em lotes para evitar problemas de tamanho de payload
      const batchSize = 50;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        const { error } = await supabase.from('notifications').insert(batch);
        if (error) throw error;
      }
      
      toast({
        title: "Notificação enviada",
        description: `Notificação enviada com sucesso para ${userIds.length} usuários.`,
      });
      
      // Limpar o formulário
      form.reset();
      
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação. Tente novamente.",
        variant: "destructive",
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatários</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    <SelectItem value="ADMIN">Apenas administradores</SelectItem>
                    <SelectItem value="CLIENT">Apenas clientes</SelectItem>
                    <SelectItem value="PARTNER">Apenas parceiros</SelectItem>
                    <SelectItem value="FINANCIAL">Apenas financeiro</SelectItem>
                    <SelectItem value="LOGISTICS">Apenas logística</SelectItem>
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
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NotificationType.GENERAL}>Geral</SelectItem>
                    <SelectItem value={NotificationType.PAYMENT}>Pagamento</SelectItem>
                    <SelectItem value={NotificationType.SALE}>Venda</SelectItem>
                    <SelectItem value={NotificationType.MACHINE}>Máquina</SelectItem>
                    <SelectItem value={NotificationType.SUPPORT}>Suporte</SelectItem>
                    <SelectItem value={NotificationType.SYSTEM}>Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite a mensagem da notificação..." 
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
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
};

export default SendNotificationForm;
