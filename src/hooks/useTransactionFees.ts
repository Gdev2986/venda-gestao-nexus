
import { useState, useCallback } from "react";
import { TransactionService } from "@/services/transaction.service";
import { TransactionFeeParams, TransactionFeeResult } from "@/types/payment.types";
import { useToast } from "@/components/ui/use-toast";

interface UseTransactionFeesResult {
  calculateFees: (params: TransactionFeeParams) => Promise<TransactionFeeResult | null>;
  formatFeeResult: (result: TransactionFeeResult) => Record<string, string>;
  checkClientHasTaxBlock: (clientId: string) => Promise<boolean>;
  isCalculating: boolean;
  feeResult: TransactionFeeResult | null;
  error: string | null;
}

export function useTransactionFees(): UseTransactionFeesResult {
  const [isCalculating, setIsCalculating] = useState(false);
  const [feeResult, setFeeResult] = useState<TransactionFeeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateFees = useCallback(async (params: TransactionFeeParams) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const result = await TransactionService.calculateTransactionFee(params);
      
      if (result) {
        setFeeResult(result);
        return result;
      } else {
        setError("Não foi possível calcular as taxas. Verifique se o cliente possui um bloco de taxas associado.");
        toast({
          title: "Erro no cálculo",
          description: "Não foi possível calcular as taxas para esta transação.",
          variant: "destructive"
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro ao calcular taxas: ${errorMessage}`);
      toast({
        title: "Erro no cálculo",
        description: `Não foi possível calcular as taxas: ${errorMessage}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [toast]);

  const checkClientHasTaxBlock = useCallback(async (clientId: string) => {
    try {
      return await TransactionService.hasClientTaxBlock(clientId);
    } catch (err) {
      return false;
    }
  }, []);

  const formatFeeResult = useCallback((result: TransactionFeeResult) => {
    return TransactionService.formatFeeResult(result);
  }, []);

  return {
    calculateFees,
    formatFeeResult,
    checkClientHasTaxBlock,
    isCalculating,
    feeResult,
    error
  };
}
