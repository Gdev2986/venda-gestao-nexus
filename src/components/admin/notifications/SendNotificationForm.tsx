
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
import { NotificationType } from "@/types/notification.types";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/types";

// Updated schema to include recipient roles
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.nativeEnum(NotificationType),
  recipient_roles: z.array(z.string()).optional(),
  sendToAll: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SendNotificationFormProps {
  onSendNotification: (notification: any) => Promise<boolean>;
}

export const SendNotificationForm = ({ onSendNotification }: SendNotificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.SYSTEM,
      recipient_roles: [],
      sendToAll: true,
    },
  });

  const sendToAll = form.watch("sendToAll");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // If sendToAll is true, don't filter by roles
      const notificationData = {
        ...data,
        recipient_roles: data.sendToAll ? [] : selectedRoles,
      };

      await onSendNotification(notificationData);
      form.reset();
      setSelectedRoles([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
    
    // Update form state
    form.setValue(
      "recipient_roles", 
      selectedRoles.includes(role) 
        ? selectedRoles.filter(r => r !== role) 
        : [...selectedRoles, role]
    );
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
                  {Object.values(NotificationType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
          name="sendToAll"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Enviar para todos os usuários
              </FormLabel>
            </FormItem>
          )}
        />

        {!sendToAll && (
          <div className="space-y-2">
            <FormLabel>Funções dos destinatários</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.values(UserRole).map((role) => (
                <div
                  key={role}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    selectedRoles.includes(role)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => handleRoleToggle(role)}
                >
                  {role}
                </div>
              ))}
            </div>
            {selectedRoles.length === 0 && !sendToAll && (
              <p className="text-sm text-destructive">
                Selecione pelo menos uma função
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading || (selectedRoles.length === 0 && !sendToAll)}
        >
          {isLoading ? "Enviando..." : "Enviar notificação"}
        </Button>
      </form>
    </Form>
  );
};
