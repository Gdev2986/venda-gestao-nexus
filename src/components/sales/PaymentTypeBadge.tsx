
import { Badge } from "@/components/ui/badge";

interface PaymentTypeBadgeProps {
  paymentType: string;
  installments?: number;
}

export const PaymentTypeBadge = ({ paymentType, installments }: PaymentTypeBadgeProps) => {
  const renderPaymentTypeBadge = () => {
    switch (paymentType) {
      case 'Cartão de Crédito':
      case 'CREDIT':
        const installmentText = installments && installments > 1 ? ` ${installments}x` : " À Vista";
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500">
            Crédito{installmentText}
          </Badge>
        );
      case 'Cartão de Débito':
      case 'DEBIT':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white border-green-600 dark:bg-green-500 dark:hover:bg-green-600 dark:border-green-500">
            Débito
          </Badge>
        );
      case 'Pix':
      case 'PIX':
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 dark:bg-purple-500 dark:hover:bg-purple-600 dark:border-purple-500">
            PIX
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700 dark:text-gray-300 dark:border-gray-400">
            {paymentType}
          </Badge>
        );
    }
  };

  return renderPaymentTypeBadge();
};
