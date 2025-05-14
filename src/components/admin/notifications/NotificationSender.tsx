
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import notificationService from "@/services/NotificationService";
import { NotificationType, UserRole } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  message: z.string().min(1, "Mensagem é obrigatória").max(500, "Mensagem deve ter no máximo 500 caracteres"),
  type: z.string().min(1, "Tipo é obrigatório"),
  role: z.string().min(1, "Destinatário é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

export function NotificationSender() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "SYSTEM",
      role: "CLIENT",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      await notificationService.createNotification(
        values.title,
        values.message,
        values.type as NotificationType,
        "",
        {}
      );
      
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso para os destinatários.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Ocorreu um erro ao enviar a notificação. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Nova Notificação</CardTitle>
        <CardDescription>
          Crie e envie notificações para usuários do sistema
        </CardDescription>
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
                        <SelectItem value="SYSTEM">Sistema</SelectItem>
                        <SelectItem value="PAYMENT">Pagamento</SelectItem>
                        <SelectItem value="BALANCE">Saldo</SelectItem>
                        <SelectItem value="MACHINE">Máquina</SelectItem>
                        <SelectItem value="COMMISSION">Comissão</SelectItem>
                        <SelectItem value="SALE">Venda</SelectItem>
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
                    <FormLabel>Destinatários</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione os destinatários" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CLIENT">Clientes</SelectItem>
                        <SelectItem value="ADMIN">Administradores</SelectItem>
                        <SelectItem value="PARTNER">Parceiros</SelectItem>
                        <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                        <SelectItem value="LOGISTICS">Logística</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
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
      </CardContent>
    </Card>
  );
}
