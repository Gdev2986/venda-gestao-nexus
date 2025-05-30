
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/formatters';
import { AlertTriangle, Upload } from 'lucide-react';

const boletoPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  boleto_code: z.string().optional(),
  boleto_file: z.any().optional(),
  notes: z.string().optional(),
});

type BoletoPaymentFormData = z.infer<typeof boletoPaymentSchema>;

interface BoletoPaymentFormProps {
  clientBalance: number;
  onSubmit: (data: BoletoPaymentFormData) => void;
  isLoading: boolean;
}

export const BoletoPaymentForm = ({ clientBalance, onSubmit, isLoading }: BoletoPaymentFormProps) => {
  const [amountInput, setAmountInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<BoletoPaymentFormData>({
    resolver: zodResolver(boletoPaymentSchema),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('boleto_file', file);
    }
  };

  const handleFormSubmit = (data: BoletoPaymentFormData) => {
    const submitData = {
      ...data,
      boleto_file: selectedFile,
    };
    onSubmit(submitData);
    
    reset();
    setAmountInput('');
    setSelectedFile(null);
  };

  const isAmountExceeded = amount > clientBalance;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Pagamento de Boleto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Saldo disponível:</strong> {formatCurrency(clientBalance)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="dark:text-white">Valor do boleto</Label>
            <Input
              id="amount"
              type="text"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isAmountExceeded ? 'border-red-500' : ''}`}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
            {isAmountExceeded && (
              <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="dark:text-red-300">
                  O valor do boleto não pode ser maior que seu saldo disponível.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="boleto_code" className="dark:text-white">Código de barras ou linha digitável (opcional)</Label>
            <Input
              id="boleto_code"
              {...register('boleto_code')}
              placeholder="Digite o código do boleto"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="boleto_file" className="dark:text-white">Arquivo do boleto (opcional)</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700/20">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                <div className="mt-2">
                  <label htmlFor="boleto_file" className="cursor-pointer">
                    <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      Clique para fazer upload
                    </span>
                    <input
                      id="boleto_file"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PDF, JPG, JPEG ou PNG até 10MB
                  </p>
                </div>
              </div>
              {selectedFile && (
                <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                  ✓ Arquivo selecionado: {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-white">Observações (opcional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informações adicionais sobre o pagamento"
              rows={3}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || amount <= 0 || isAmountExceeded}
          >
            {isLoading ? 'Enviando...' : `Solicitar pagamento de ${formatCurrency(amount)}`}
          </Button>

          <Alert className="dark:bg-yellow-900/20 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="dark:text-yellow-300">
              O valor será debitado do seu saldo após a confirmação do pagamento.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
};
