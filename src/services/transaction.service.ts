
import { supabase } from "@/integrations/supabase/client";
import { TaxBlocksService } from "./tax-blocks.service";
import { PaymentMethod } from "@/types/enums";
import { TransactionFeeParams, TransactionFeeResult } from "@/types/payment.types";
import { formatCurrency } from "@/lib/utils";

export const TransactionService = {
  /**
   * Calculates the transaction fee for a given payment
   * @param params Parameters for fee calculation
   * @returns Calculation result with fee amounts and rates
   */
  async calculateTransactionFee(params: TransactionFeeParams): Promise<TransactionFeeResult | null> {
    try {
      console.log("Calculating transaction fee for:", params);
      
      // Get the tax rate for this client, payment method and installment
      const taxRate = await TaxBlocksService.getClientTaxRate(
        params.client_id,
        params.payment_method as PaymentMethod,
        params.installments
      );
      
      if (!taxRate) {
        console.error("No tax rate found for the client, payment method and installment");
        return null;
      }
      
      // Get the tax block info
      const taxBlock = await TaxBlocksService.getTaxBlock(taxRate.block_id);
      
      // Calculate fees
      const rootFee = (params.amount * (taxRate.root_rate / 100));
      const forwardingFee = (params.amount * (taxRate.forwarding_rate / 100));
      
      // The final rate includes all fees
      const finalFee = (params.amount * (taxRate.final_rate / 100));
      
      // Calculate net amount (original amount minus final fee)
      const netAmount = params.amount - finalFee;
      
      console.log("Fee calculation complete:", {
        amount: params.amount,
        total_fee: finalFee,
        net_amount: netAmount,
        final_rate: taxRate.final_rate,
        taxRate
      });
      
      return {
        amount: params.amount,
        root_rate: taxRate.root_rate,
        forwarding_rate: taxRate.forwarding_rate,
        final_rate: taxRate.final_rate,
        root_fee: rootFee,
        forwarding_fee: forwardingFee,
        total_fee: finalFee,
        net_amount: netAmount,
        taxBlockInfo: taxBlock ? {
          name: taxBlock.name,
          description: taxBlock.description
        } : undefined
      };
    } catch (error) {
      console.error("Error calculating transaction fee:", error);
      return null;
    }
  },
  
  /**
   * Formats the transaction fee result for display
   * @param result Fee calculation result
   * @returns Object with formatted values for display
   */
  formatFeeResult(result: TransactionFeeResult) {
    return {
      amount: formatCurrency(result.amount),
      net_amount: formatCurrency(result.net_amount),
      total_fee: formatCurrency(result.total_fee),
      feePercentage: `${result.final_rate?.toFixed(2) || '0.00'}%`,
      root_fee: formatCurrency(result.root_fee),
      forwarding_fee: formatCurrency(result.forwarding_fee)
    };
  },
  
  /**
   * Checks if a client has an associated tax block
   * @param clientId Client ID to check
   * @returns True if the client has a tax block, false otherwise
   */
  async hasClientTaxBlock(clientId: string): Promise<boolean> {
    try {
      const block = await TaxBlocksService.getClientTaxBlock(clientId);
      return block !== null;
    } catch (error) {
      console.error("Error checking if client has tax block:", error);
      return false;
    }
  }
};
