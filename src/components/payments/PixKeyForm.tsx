
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { PixKeyType } from '@/types/payment.types';

interface PixKeyFormProps {
  onSuccess?: () => void;
}

const pixKeyFormSchema = z.object({
  key: z.string().min(1, {
    message: 'Chave não pode estar vazia.',
  }),
  type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP', 'RANDOM']),
  name: z.string().min(1, {
    message: 'Nome não pode estar vazio.',
  }),
});

type PixKeyFormValues = z.infer<typeof pixKeyFormSchema>;

export const PixKeyForm = ({ onSuccess }: PixKeyFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeyFormSchema),
    defaultValues: {
      key: '',
      type: 'CPF',
      name: '',
    },
  });

  const onSubmit = async (data: PixKeyFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para cadastrar uma chave PIX.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('pix_keys').insert({
        key: data.key,
        type: data.type,
        name: data.name,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Chave PIX cadastrada com sucesso!',
      });

      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error adding PIX key:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível cadastrar a chave PIX.',
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
                disabled={isSubmitting}
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
                  <SelectItem value="RANDOM">Chave aleatória (antiga)</SelectItem>
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
                  placeholder="Informe sua chave PIX"
                  disabled={isSubmitting}
                  {...field}
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
              <FormLabel>Nome do Titular</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do titular da conta"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Adicionar Chave PIX'}
        </Button>
      </form>
    </Form>
  );
};

export default PixKeyForm;
