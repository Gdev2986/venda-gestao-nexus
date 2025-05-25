import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PaymentMethod } from "@/types/enums";
import { TransactionFeeResult } from "@/types/payment.types";
import { useTransactionFees } from "@/hooks/useTransactionFees";
import { Calculator, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TransactionFeeCalculatorProps {
  clientId: string;
  clientName?: string;
  onCalculate?: (result: TransactionFeeResult) => void;
}

export function TransactionFeeCalculator({ 
  clientId, 
  clientName, 
  onCalculate 
}: TransactionFeeCalculatorProps) {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT);
  const [installments, setInstallments] = useState<number>(1);
  const [hasTaxBlock, setHasTaxBlock] = useState<boolean | null>(null);
  const [isCheckingTaxBlock, setIsCheckingTaxBlock] = useState(false);
  
  const { 
    calculateFees, 
    formatFeeResult, 
    checkClientHasTaxBlock,
    isCalculating, 
    feeResult, 
    error 
  } = useTransactionFees();

  useEffect(() => {
    const checkTaxBlock = async () => {
      if (clientId) {
        setIsCheckingTaxBlock(true);
        const result = await checkClientHasTaxBlock(clientId);
        setHasTaxBlock(result);
        setIsCheckingTaxBlock(false);
      }
    };
    
    checkTaxBlock();
  }, [clientId, checkClientHasTaxBlock]);
  
  const handleCalculate = async () => {
    if (!amount || amount <= 0) return;
    
    const result = await calculateFees({
      client_id: clientId,
      payment_method: paymentMethod,
      installments,
      amount
    });
    
    if (result && onCalculate) {
      onCalculate(result);
    }
  };
  
  const getInstallmentOptions = () => {
    if (paymentMethod === PaymentMethod.PIX) return [1];
    if (paymentMethod === PaymentMethod.DEBIT) return [1];
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(parseFloat(value) || 0);
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
    // Reset installments to 1 when changing payment method
    if (value !== PaymentMethod.CREDIT) {
      setInstallments(1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Calculadora de Taxas
          {clientName && <span className="ml-2 text-sm text-muted-foreground">({clientName})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCheckingTaxBlock ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Verificando configuração de taxas...</span>
          </div>
        ) : hasTaxBlock === false ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Bloco de taxas não configurado</AlertTitle>
            <AlertDescription>
              Este cliente não possui um bloco de taxas associado. Associe um bloco de taxas antes de calcular.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor da Transação (R$)</Label>
                  <Input
                    id="amount"
                    type="text"
                    value={amount || ''}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Método de Pagamento</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PaymentMethod.CREDIT}>Crédito</SelectItem>
                      <SelectItem value={PaymentMethod.DEBIT}>Débito</SelectItem>
                      <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Select
                    value={String(installments)}
                    onValueChange={(value) => setInstallments(parseInt(value))}
                    disabled={paymentMethod !== PaymentMethod.CREDIT}
                  >
                    <SelectTrigger id="installments">
                      <SelectValue placeholder="Selecione as parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {getInstallmentOptions().map(option => (
                        <SelectItem key={option} value={String(option)}>
                          {option === 1 ? `${option} parcela` : `${option} parcelas`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleCalculate} 
                disabled={amount <= 0 || isCalculating}
                className="w-full"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>Calcular Taxas</>
                )}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro no cálculo</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {feeResult && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Resultado do Cálculo</h3>
                
                <div className="flex justify-between items-center mb-4 py-2 px-4 bg-muted rounded-md">
                  <div>
                    <p className="font-semibold text-sm">Valor Original</p>
                    <p className="text-2xl">{formatFeeResult(feeResult).amount}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-sm">Valor Líquido</p>
                    <p className="text-2xl">{formatFeeResult(feeResult).net_amount}</p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Taxa Total ({feeResult.final_rate?.toFixed(2) || '0.00'}%)</TableCell>
                      <TableCell className="text-right">{formatFeeResult(feeResult).total_fee}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6 text-sm text-muted-foreground">└ Taxa Root</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatFeeResult(feeResult).root_fee}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6 text-sm text-muted-foreground">└ Taxa de Repasse</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatFeeResult(feeResult).forwarding_fee}</TableCell>
                    </TableRow>
                    {feeResult.taxBlockInfo && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-xs text-muted-foreground">
                          Bloco de taxas: {feeResult.taxBlockInfo.name}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
