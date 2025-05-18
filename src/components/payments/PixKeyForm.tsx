import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const FormSchema = z.object({
  key: z.string().min(2, {
    message: "Chave Pix é obrigatória.",
  }),
  name: z.string().min(2, {
    message: "Nome é obrigatório.",
  }),
  type: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "EVP", "RANDOM"]),
  isDefault: z.boolean().default(false).optional(),
});

interface PixKeyFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export function PixKeyForm({ onCancel, onSubmit }: PixKeyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      key: "",
      name: "",
      type: "EMAIL",
      isDefault: false,
    },
  });

  async function handleCreatePixKey(values: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const { error: insertError } = await supabase
        .from('pix_keys')
        .insert({
          user_id: user.id,
          key: values.key,
          name: values.name,
          type: values.type as any,
          is_default: values.isDefault || false,
        });

      if (insertError) {
        throw new Error(`Erro ao criar chave Pix: ${insertError.message}`);
      }

      toast({
        title: "Sucesso",
        description: "Chave Pix criada com sucesso!",
      });

      onSubmit();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreatePixKey)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave Pix</FormLabel>
              <FormControl>
                <Input placeholder="Sua chave Pix" {...field} />
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da chave Pix" {...field} />
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
              <FormLabel>Tipo de Chave</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <SelectItem value="EVP">EVP</SelectItem>
                  <SelectItem value="RANDOM">Aleatória</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium leading-none">
                  Chave padrão
                </FormLabel>
                <FormDescription>
                  Defina como chave padrão para recebimentos.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Chave"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
