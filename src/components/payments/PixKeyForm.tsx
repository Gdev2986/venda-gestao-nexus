
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/use-user";

// Define PixKeyType separately here to avoid import issues
export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP' | 'RANDOM';

// Props for PixKeyForm component
export interface PixKeyFormProps {
  onSuccess?: () => void;
}

// Define form schema using zod
const pixKeySchema = z.object({
  key: z.string().min(1, { message: "Chave PIX é obrigatória" }),
  type: z.string().min(1, { message: "Tipo de chave é obrigatório" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
});

type PixKeyFormValues = z.infer<typeof pixKeySchema>;

export const PixKeyForm: React.FC<PixKeyFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      key: "",
      type: "",
      name: "",
    },
  });

  const onSubmit = async (values: PixKeyFormValues) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Usuário não autenticado",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("pix_keys").insert({
        user_id: user.id,
        key: values.key,
        type: values.type,
        name: values.name,
      });

      if (error) throw error;

      toast({
        title: "Chave PIX adicionada",
        description: "Sua chave PIX foi adicionada com sucesso.",
      });

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error adding PIX key:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar a chave PIX.",
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Chave</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de chave" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="PHONE">Telefone</SelectItem>
                  <SelectItem value="EVP">Chave aleatória</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave PIX</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite sua chave PIX"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Chave</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Minha chave principal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar Chave PIX"}
        </Button>
      </form>
    </Form>
  );
};

export default PixKeyForm;
