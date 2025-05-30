
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TedPaymentFormProps {
  clientBalance: number;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const TedPaymentForm = ({ clientBalance, onSubmit, isLoading }: TedPaymentFormProps) => {
  const [amount, setAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [bankCode, setBankCode] = useState('');
  const [agencyNumber, setAgencyNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'corrente' | 'poupanca'>('corrente');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (parseFloat(amount) > clientBalance) {
      newErrors.amount = 'Valor não pode ser maior que o saldo disponível';
    }

    if (!beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Nome do beneficiário é obrigatório';
    }

    if (!beneficiaryDocument.trim()) {
      newErrors.beneficiaryDocument = `${documentType} é obrigatório`;
    }

    if (!bankCode.trim()) {
      newErrors.bankCode = 'Código do banco é obrigatório';
    }

    if (!agencyNumber.trim()) {
      newErrors.agencyNumber = 'Número da agência é obrigatório';
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Número da conta é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formData = {
      amount: parseFloat(amount),
      beneficiary_name: beneficiaryName,
      beneficiary_document: beneficiaryDocument,
      document_type: documentType,
      bank_code: bankCode,
      agency_number: agencyNumber,
      account_number: accountNumber,
      account_type: accountType,
      notes: notes || 'Solicitação de TED'
    };

    await onSubmit(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Saldo disponível:</strong> {formatCurrency(clientBalance)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor a transferir *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            max={clientBalance}
            className="pl-8"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beneficiaryName">Nome do Beneficiário *</Label>
          <Input
            id="beneficiaryName"
            placeholder="Nome completo ou razão social"
            value={beneficiaryName}
            onChange={(e) => setBeneficiaryName(e.target.value)}
          />
          {errors.beneficiaryName && <p className="text-sm text-red-500">{errors.beneficiaryName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento *</Label>
          <Select value={documentType} onValueChange={(value: 'CPF' | 'CNPJ') => setDocumentType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CPF">CPF</SelectItem>
              <SelectItem value="CNPJ">CNPJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="beneficiaryDocument">{documentType} *</Label>
        <Input
          id="beneficiaryDocument"
          placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
          value={beneficiaryDocument}
          onChange={(e) => setBeneficiaryDocument(e.target.value)}
        />
        {errors.beneficiaryDocument && <p className="text-sm text-red-500">{errors.beneficiaryDocument}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bankCode">Código do Banco *</Label>
          <Input
            id="bankCode"
            placeholder="Ex: 001, 033, 237"
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
          />
          {errors.bankCode && <p className="text-sm text-red-500">{errors.bankCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agencyNumber">Agência *</Label>
          <Input
            id="agencyNumber"
            placeholder="Ex: 1234-5"
            value={agencyNumber}
            onChange={(e) => setAgencyNumber(e.target.value)}
          />
          {errors.agencyNumber && <p className="text-sm text-red-500">{errors.agencyNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Conta *</Label>
          <Input
            id="accountNumber"
            placeholder="Ex: 12345-6"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountType">Tipo de Conta *</Label>
        <Select value={accountType} onValueChange={(value: 'corrente' | 'poupanca') => setAccountType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corrente">Conta Corrente</SelectItem>
            <SelectItem value="poupanca">Conta Poupança</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais sobre a transferência"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Prazo de Processamento:</strong> Recebimento no mesmo dia se a solicitação for feita até 15h45, após esse horário será realizado no próximo dia útil.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Solicitando...
            </>
          ) : (
            `Solicitar TED`
          )}
        </Button>
      </div>
    </form>
  );
};
