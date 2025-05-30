
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { PixKey } from '@/types/payment.types';
import { formatCurrency } from '@/lib/utils';

const pixKeySchema = z.object({
  type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP']),
  key: z.string().min(1, 'Chave PIX é obrigatória'),
  name: z.string().min(1, 'Nome da chave é obrigatório'),
  owner_name: z.string().min(1, 'Nome do titular é obrigatório')
});

const pixPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  pix_key_id: z.string().optional(),
  new_pix_key: pixKeySchema.optional(),
  save_new_key: z.boolean().default(false),
  notes: z.string().optional()
});

type PixPaymentFormData = z.infer<typeof pixPaymentSchema>;

interface PixPaymentFormProps {
  clientBalance: number;
  pixKeys: PixKey[];
  onSubmit: (data: PixPaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

export const PixPaymentForm = ({
  clientBalance,
  pixKeys,
  onSubmit,
  isLoading = false
}: PixPaymentFormProps) => {
  const [useNewKey, setUseNewKey] = useState(false);

  const form = useForm<PixPaymentFormData>({
    resolver: zodResolver(pixPaymentSchema),
    defaultValues: {
      amount: 0,
      save_new_key: false,
      notes: ''
    }
  });

  const handleSubmit = async (data: PixPaymentFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de Pagamento PIX</CardTitle>
          <p className="text-sm text-muted-foreground">
            Saldo disponível: {formatCurrency(clientBalance)}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor a solicitar</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max={clientBalance}
              placeholder="0,00"
              {...form.register('amount', { valueAsNumber: true })}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label>Chave PIX</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                type="button"
                variant={!useNewKey ? "default" : "outline"}
                size="sm"
                onClick={() => setUseNewKey(false)}
              >
                Usar chave existente
              </Button>
              <Button
                type="button"
                variant={useNewKey ? "default" : "outline"}
                size="sm"
                onClick={() => setUseNewKey(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova chave
              </Button>
            </div>
          </div>

          {!useNewKey ? (
            <div>
              <Label htmlFor="pix_key_id">Selecionar chave existente</Label>
              <Select onValueChange={(value) => form.setValue('pix_key_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent>
                  {pixKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id}>
                      {key.name} - {key.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nova Chave PIX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="key_type">Tipo da chave</Label>
                  <Select onValueChange={(value) => form.setValue('new_pix_key.type', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                      <SelectItem value="EMAIL">E-mail</SelectItem>
                      <SelectItem value="PHONE">Telefone</SelectItem>
                      <SelectItem value="EVP">Chave aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="key">Chave PIX</Label>
                  <Input
                    id="key"
                    placeholder="Digite a chave PIX"
                    {...form.register('new_pix_key.key')}
                  />
                </div>

                <div>
                  <Label htmlFor="key_name">Nome da chave</Label>
                  <Input
                    id="key_name"
                    placeholder="Ex: Conta principal"
                    {...form.register('new_pix_key.name')}
                  />
                </div>

                <div>
                  <Label htmlFor="owner_name">Nome do titular</Label>
                  <Input
                    id="owner_name"
                    placeholder="Nome completo do titular"
                    {...form.register('new_pix_key.owner_name')}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save_key"
                    checked={form.watch('save_new_key')}
                    onCheckedChange={(checked) => form.setValue('save_new_key', !!checked)}
                  />
                  <Label htmlFor="save_key">Salvar esta chave para futuras solicitações</Label>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione informações adicionais se necessário"
              {...form.register('notes')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Solicitar Pagamento PIX'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
