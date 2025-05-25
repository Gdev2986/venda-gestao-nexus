
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cpfMask, cnpjMask, phoneNumberMask } from '@/lib/masks';
import { PixKeyType } from '@/types/payment.types';

// Define the schema for the form
const pixKeySchema = z.object({
  type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP']),
  key: z.string().min(1, 'A chave Pix é obrigatória'),
  name: z.string().min(1, 'O nome é obrigatório'),
  is_default: z.boolean().optional(),
});

type PixKeyFormData = z.infer<typeof pixKeySchema>;

interface PixKeyFormProps {
  onSubmit: (data: PixKeyFormData) => Promise<void>;
  initialData?: Partial<PixKeyFormData>;
  onCancel?: () => void;
}

export function PixKeyForm({ onSubmit, initialData, onCancel }: PixKeyFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values or initialData
  const form = useForm<PixKeyFormData>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      type: initialData?.type || 'CPF',
      key: initialData?.key || '',
      name: initialData?.name || '',
      is_default: initialData?.is_default || false,
    },
  });

  // Handle type changes to apply masks accordingly
  const currentType = form.watch('type');
  
  // Apply masks based on the type
  useEffect(() => {
    const currentKey = form.getValues('key');
    if (!currentKey) return;
    
    let formattedKey = currentKey;
    
    switch (currentType) {
      case 'CPF':
        formattedKey = cpfMask(currentKey);
        break;
      case 'CNPJ':
        formattedKey = cnpjMask(currentKey);
        break;
      case 'PHONE':
        formattedKey = phoneNumberMask(currentKey);
        break;
      // EMAIL and EVP don't need formatting
      default:
        break;
    }
    
    if (formattedKey !== currentKey) {
      form.setValue('key', formattedKey);
    }
  }, [currentType, form]);

  const handleSubmit = async (data: PixKeyFormData) => {
    // Clean up the key value based on the type
    let cleanKey = data.key;
    
    switch (data.type) {
      case 'CPF':
      case 'CNPJ':
      case 'PHONE':
        // Remove all non-numeric characters
        cleanKey = data.key.replace(/\D/g, '');
        break;
      default:
        break;
    }
    
    // Update the key with the clean value
    const submissionData = {
      ...data,
      key: cleanKey,
    };
    
    setIsSubmitting(true);
    try {
      await onSubmit(submissionData);
      toast({
        title: "Chave Pix salva",
        description: "Sua chave Pix foi registrada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar a chave Pix",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              <FormLabel>Chave Pix</FormLabel>
              <FormControl>
                <Input
                  placeholder={getPlaceholder(currentType as PixKeyType)}
                  {...field}
                  disabled={isSubmitting}
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
                  placeholder="Nome completo do titular da chave"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Adicionar")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Helper function to get appropriate placeholder based on key type
function getPlaceholder(type: PixKeyType): string {
  switch (type) {
    case 'CPF':
      return '000.000.000-00';
    case 'CNPJ':
      return '00.000.000/0000-00';
    case 'EMAIL':
      return 'exemplo@email.com';
    case 'PHONE':
      return '(00) 00000-0000';
    case 'EVP':
      return 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    default:
      return '';
  }
}
