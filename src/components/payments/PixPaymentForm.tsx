
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PixKey } from '@/types/payment.types';
import { formatCurrency } from '@/lib/formatters';
import { AlertTriangle, Plus } from 'lucide-react';

const pixPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  pix_key_id: z.string().optional(),
  new_pix_key: z.object({
    type: z.enum(['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM']),
    key: z.string().min(1, 'Chave PIX é obrigatória'),
    name: z.string().min(1, 'Nome é obrigatório'),
    owner_name: z.string().min(1, 'Nome do titular é obrigatório'),
  }).optional(),
  notes: z.string().optional(),
});

type PixPaymentFormData = z.infer<typeof pixPaymentSchema>;

interface PixPaymentFormProps {
  clientBalance: number;
  pixKeys: PixKey[];
  onSubmit: (data: PixPaymentFormData) => void;
  isLoading: boolean;
}

export const PixPaymentForm = ({ clientBalance, pixKeys, onSubmit, isLoading }: PixPaymentFormProps) => {
  const [useNewKey, setUseNewKey] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<PixPaymentFormData>({
    resolver: zodResolver(pixPaymentSchema),
    defaultValues: {
      amount: 0,
      notes: '',
    }
  });

  const amount = watch('amount');

  const formatAmountInput = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Se não há números, retorna vazio
    if (!numbers) return '';
    
    // Converte para centavos e depois para reais
    const cents = parseInt(numbers);
    const reais = cents / 100;
    
    // Formatar como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(reais);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatAmountInput(inputValue);
    
    // Extrai o valor numérico do campo formatado
    const numericValue = parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    // Verifica se excede o saldo
    if (numericValue <= clientBalance) {
      setAmountInput(formatted);
      setValue('amount', numericValue);
    } else {
      // Se exceder, define o valor máximo como o saldo disponível
      const maxFormatted = formatCurrency(clientBalance);
      setAmountInput(maxFormatted);
      setValue('amount', clientBalance);
    }
  };

  const handleFormSubmit = (data: PixPaymentFormData) => {
    if (useNewKey) {
      // Remove pix_key_id se estamos criando uma nova chave
      const { pix_key_id, ...submitData } = data;
      onSubmit(submitData);
    } else {
      // Remove new_pix_key se estamos usando uma chave existente
      const { new_pix_key, ...submitData } = data;
      onSubmit(submitData);
    }
    
    // Reset form after submission
    reset();
    setAmountInput('');
    setUseNewKey(false);
  };

  const isAmountExceeded = amount > clientBalance;
  const hasAvailableKeys = pixKeys.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitação PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Saldo disponível */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Saldo disponível:</strong> {formatCurrency(clientBalance)}
            </p>
          </div>

          {/* Valor a solicitar */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor a solicitar</Label>
            <Input
              id="amount"
              type="text"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              className={isAmountExceeded ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
            {isAmountExceeded && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  O valor solicitado não pode ser maior que seu saldo disponível.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Seleção de chave PIX */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Chave PIX para recebimento</Label>
              {hasAvailableKeys && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseNewKey(!useNewKey)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {useNewKey ? 'Usar chave existente' : 'Nova chave'}
                </Button>
              )}
            </div>

            {!useNewKey && hasAvailableKeys ? (
              <Select onValueChange={(value) => setValue('pix_key_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent>
                  {pixKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{key.name}</span>
                        <span className="text-sm text-gray-500">
                          {key.type}: {key.key}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-3 border rounded-lg p-4">
                <h4 className="font-medium">Nova Chave PIX</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="new_key_name">Nome da chave</Label>
                    <Input
                      id="new_key_name"
                      {...register('new_pix_key.name')}
                      placeholder="Ex: Minha chave"
                    />
                    {errors.new_pix_key?.name && (
                      <p className="text-sm text-red-600">{errors.new_pix_key.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="new_key_type">Tipo</Label>
                    <Select onValueChange={(value) => setValue('new_pix_key.type', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo da chave" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="PHONE">Telefone</SelectItem>
                        <SelectItem value="RANDOM">Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.new_pix_key?.type && (
                      <p className="text-sm text-red-600">{errors.new_pix_key.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="new_key_value">Chave PIX</Label>
                  <Input
                    id="new_key_value"
                    {...register('new_pix_key.key')}
                    placeholder="Digite a chave PIX"
                  />
                  {errors.new_pix_key?.key && (
                    <p className="text-sm text-red-600">{errors.new_pix_key.key.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new_key_owner">Nome do titular</Label>
                  <Input
                    id="new_key_owner"
                    {...register('new_pix_key.owner_name')}
                    placeholder="Nome completo do titular"
                  />
                  {errors.new_pix_key?.owner_name && (
                    <p className="text-sm text-red-600">{errors.new_pix_key.owner_name.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informações adicionais sobre a solicitação"
              rows={3}
            />
          </div>

          {/* Botão de envio */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || amount <= 0 || isAmountExceeded || (!useNewKey && !hasAvailableKeys && !watch('pix_key_id'))}
          >
            {isLoading ? 'Enviando...' : `Solicitar ${formatCurrency(amount)}`}
          </Button>

          {!hasAvailableKeys && !useNewKey && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você não possui chaves PIX cadastradas. Clique em "Nova chave" para criar uma.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
