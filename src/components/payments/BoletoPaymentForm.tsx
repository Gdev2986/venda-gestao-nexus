
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatCurrency } from '@/lib/utils';

const boletoPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  boleto_code: z.string().optional(),
  notes: z.string().optional()
});

type BoletoPaymentFormData = z.infer<typeof boletoPaymentSchema>;

interface BoletoPaymentFormProps {
  clientBalance: number;
  onSubmit: (data: BoletoPaymentFormData & { boleto_file?: File }) => Promise<void>;
  isLoading?: boolean;
}

export const BoletoPaymentForm = ({
  clientBalance,
  onSubmit,
  isLoading = false
}: BoletoPaymentFormProps) => {
  const [boletoFile, setBoletoFile] = useState<File | null>(null);

  const fileUpload = useFileUpload({
    bucket: 'payment-files',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxSizeInMB: 10
  });

  const form = useForm<BoletoPaymentFormData>({
    resolver: zodResolver(boletoPaymentSchema),
    defaultValues: {
      amount: 0,
      boleto_code: '',
      notes: ''
    }
  });

  const handleSubmit = async (data: BoletoPaymentFormData) => {
    await onSubmit({
      ...data,
      boleto_file: boletoFile || undefined
    });
  };

  const handleFileSelect = (file: File) => {
    setBoletoFile(file);
  };

  const handleFileRemove = () => {
    setBoletoFile(null);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento de Boleto</CardTitle>
          <p className="text-sm text-muted-foreground">
            Saldo disponível: {formatCurrency(clientBalance)}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor do boleto</Label>
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
            <Label>Arquivo do boleto (opcional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Envie o boleto em PDF ou imagem para facilitar a confirmação
            </p>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']}
              maxSizeInMB={10}
              currentFile={boletoFile || undefined}
              isUploading={fileUpload.isUploading}
              uploadProgress={fileUpload.uploadProgress}
            />
          </div>

          <div>
            <Label htmlFor="boleto_code">Código do boleto (opcional)</Label>
            <Input
              id="boleto_code"
              placeholder="Digite o código de barras ou linha digitável"
              {...form.register('boleto_code')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Código de barras ou linha digitável do boleto
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Adicione informações sobre o boleto (vencimento, beneficiário, etc.)"
              {...form.register('notes')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Inclua informações relevantes para confirmar o pagamento
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Boleto para Pagamento'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
