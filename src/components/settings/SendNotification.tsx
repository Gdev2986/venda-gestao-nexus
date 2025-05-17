import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserRole, NotificationType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título deve ter pelo menos 2 caracteres.",
  }),
  message: z.string().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres.",
  }),
  type: z.nativeEnum(NotificationType, {
    errorMap: () => ({ message: "Por favor, selecione um tipo de notificação." }),
  }),
});

interface SendNotificationProps {
  onSuccess?: () => void;
}

const SendNotification = ({ onSuccess }: SendNotificationProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .in('role', [UserRole.USER, UserRole.ADMIN]);

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message || "Ocorreu um erro ao carregar os usuários."
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.GENERAL,
    },
  });

  const { reset } = form;

  const handleSendNotification = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Convert the enum string to the correct enum value
      const notificationType = values.type as "SUPPORT" | "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "GENERAL" | "SALE";
    
      // Insert the notification
      const { error } = await supabase.from('notifications').insert({
        title: values.title,
        message: values.message,
        type: notificationType,
        user_id: selectedUser
      });
    
      if (error) throw error;
    
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso."
      });
    
      setSelectedUser('');
      reset();
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSendNotification)} className="space-y-4">
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
                  placeholder="Escreva sua mensagem aqui."
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
              <FormLabel>Tipo de Notificação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
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
        <div className="grid gap-2">
          <FormLabel htmlFor="user">Enviar para</FormLabel>
          <Select onValueChange={setSelectedUser} defaultValue={selectedUser}>
            <SelectTrigger id="user">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.full_name} ({user.role})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Notificação"}
        </Button>
      </form>
    </Form>
  );
};

export default SendNotification;
