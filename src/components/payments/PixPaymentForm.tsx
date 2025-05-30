
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
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const cents = parseInt(numbers);
    const reais = cents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(reais);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatAmountInput(inputValue);
    const numericValue = parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    if (numericValue <= clientBalance) {
      setAmountInput(formatted);
      setValue('amount', numericValue);
    } else {
      const maxFormatted = formatCurrency(clientBalance);
      setAmountInput(maxFormatted);
      setValue('amount', clientBalance);
    }
  };

  const handleFormSubmit = (data: PixPaymentFormData) => {
    if (useNewKey) {
      const { pix_key_id, ...submitData } = data;
      onSubmit(submitData);
    } else {
      const { new_pix_key, ...submitData } = data;
      onSubmit(submitData);
    }
    
    reset();
    setAmountInput('');
    setUseNewKey(false);
  };

  const isAmountExceeded = amount > clientBalance;
  const hasAvailableKeys = pixKeys.length > 0;

  return (
    <Card className="dark:bg-[#1f1f1f] dark:border-[#262626]">
      <CardHeader>
        <CardTitle className="dark:text-white">Solicitação PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="bg-blue-50 dark:bg-[#262626] p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Saldo disponível:</strong> {formatCurrency(clientBalance)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="dark:text-white">Valor a solicitar</Label>
            <Input
              id="amount"
              type="text"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              className={`dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white ${isAmountExceeded ? 'border-red-500' : ''}`}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
            {isAmountExceeded && (
              <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="dark:text-red-300">
                  O valor solicitado não pode ser maior que seu saldo disponível.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="dark:text-white">Chave PIX para recebimento</Label>
              {hasAvailableKeys && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseNewKey(!useNewKey)}
                  className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white dark:hover:bg-[#262626]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {useNewKey ? 'Usar chave existente' : 'Nova chave'}
                </Button>
              )}
            </div>

            {!useNewKey && hasAvailableKeys ? (
              <Select onValueChange={(value) => setValue('pix_key_id', value)}>
                <SelectTrigger className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white">
                  <SelectValue placeholder="Selecione uma chave PIX" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1f1f1f] dark:border-[#262626]">
                  {pixKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id} className="dark:text-white dark:focus:bg-[#262626]">
                      <div className="flex flex-col">
                        <span className="font-medium">{key.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {key.type}: {key.key}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-3 border rounded-lg p-4 dark:border-[#262626] dark:bg-[#262626]/20">
                <h4 className="font-medium dark:text-white">Nova Chave PIX</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="new_key_name" className="dark:text-white">Nome da chave</Label>
                    <Input
                      id="new_key_name"
                      {...register('new_pix_key.name')}
                      placeholder="Ex: Minha chave"
                      className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white"
                    />
                    {errors.new_pix_key?.name && (
                      <p className="text-sm text-red-600">{errors.new_pix_key.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="new_key_type" className="dark:text-white">Tipo</Label>
                    <Select onValueChange={(value) => setValue('new_pix_key.type', value as any)}>
                      <SelectTrigger className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white">
                        <SelectValue placeholder="Tipo da chave" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1f1f1f] dark:border-[#262626]">
                        <SelectItem value="CPF" className="dark:text-white dark:focus:bg-[#262626]">CPF</SelectItem>
                        <SelectItem value="CNPJ" className="dark:text-white dark:focus:bg-[#262626]">CNPJ</SelectItem>
                        <SelectItem value="EMAIL" className="dark:text-white dark:focus:bg-[#262626]">Email</SelectItem>
                        <SelectItem value="PHONE" className="dark:text-white dark:focus:bg-[#262626]">Telefone</SelectItem>
                        <SelectItem value="RANDOM" className="dark:text-white dark:focus:bg-[#262626]">Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.new_pix_key?.type && (
                      <p className="text-sm text-red-600">{errors.new_pix_key.type.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="new_key_value" className="dark:text-white">Chave PIX</Label>
                  <Input
                    id="new_key_value"
                    {...register('new_pix_key.key')}
                    placeholder="Digite a chave PIX"
                    className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white"
                  />
                  {errors.new_pix_key?.key && (
                    <p className="text-sm text-red-600">{errors.new_pix_key.key.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="new_key_owner" className="dark:text-white">Nome do titular</Label>
                  <Input
                    id="new_key_owner"
                    {...register('new_pix_key.owner_name')}
                    placeholder="Nome completo do titular"
                    className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white"
                  />
                  {errors.new_pix_key?.owner_name && (
                    <p className="text-sm text-red-600">{errors.new_pix_key.owner_name.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-white">Observações (opcional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informações adicionais sobre a solicitação"
              rows={3}
              className="dark:bg-[#1a1a1a] dark:border-[#262626] dark:text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || amount <= 0 || isAmountExceeded || (!useNewKey && !hasAvailableKeys && !watch('pix_key_id'))}
          >
            {isLoading ? 'Enviando...' : `Solicitar ${formatCurrency(amount)}`}
          </Button>

          {!hasAvailableKeys && !useNewKey && (
            <Alert className="dark:bg-yellow-900/20 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="dark:text-yellow-300">
                Você não possui chaves PIX cadastradas. Clique em "Nova chave" para criar uma.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
