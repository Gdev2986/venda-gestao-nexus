
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod } from '@/types/payment.types';
import { useTransactionFees } from '@/hooks/useTransactionFees';
import { formatCurrency } from '@/lib/formatters';

const TransactionFeeCalculator = () => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [installments, setInstallments] = useState<number>(1);
  
  const { calculateFee, isLoading } = useTransactionFees();
  const [feeResult, setFeeResult] = useState<any>(null);

  const handleCalculate = async () => {
    if (amount <= 0) return;

    try {
      const result = await calculateFee({
        amount,
        paymentMethod,
        installments: paymentMethod === PaymentMethod.CREDIT ? installments : 1
      });
      setFeeResult(result);
    } catch (error) {
      console.error('Error calculating fee:', error);
    }
  };

  useEffect(() => {
    if (amount > 0) {
      handleCalculate();
    }
  }, [amount, paymentMethod, installments]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Taxas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Transação</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                  <SelectItem value={PaymentMethod.DEBIT}>Cartão de Débito</SelectItem>
                  <SelectItem value={PaymentMethod.CREDIT}>Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === PaymentMethod.CREDIT && (
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Select value={installments.toString()} onValueChange={(value) => setInstallments(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={handleCalculate} disabled={isLoading || amount <= 0} className="w-full">
            {isLoading ? 'Calculando...' : 'Calcular Taxas'}
          </Button>
        </CardContent>
      </Card>

      {feeResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valor Bruto</Label>
                <p className="text-lg font-semibold">{formatCurrency(feeResult.grossAmount)}</p>
              </div>
              <div>
                <Label>Valor Líquido</Label>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(feeResult.netAmount)}</p>
              </div>
              <div>
                <Label>Taxa Aplicada</Label>
                <p className="text-lg font-semibold">{formatCurrency(feeResult.feeAmount)}</p>
              </div>
              <div>
                <Label>Percentual</Label>
                <p className="text-lg font-semibold">{feeResult.feePercentage.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionFeeCalculator;
