
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PixPaymentForm } from './PixPaymentForm';
import { BoletoPaymentForm } from './BoletoPaymentForm';
import { PixKey } from '@/types/payment.types';

interface PaymentRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientBalance: number;
  pixKeys: PixKey[];
  isLoadingPixKeys: boolean;
  onRequestPayment: (type: 'PIX' | 'BOLETO', data: any) => Promise<void>;
}

export const PaymentRequestDialog = ({
  isOpen,
  onOpenChange,
  clientBalance,
  pixKeys,
  isLoadingPixKeys,
  onRequestPayment
}: PaymentRequestDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePixPayment = async (data: any) => {
    setIsLoading(true);
    try {
      await onRequestPayment('PIX', data);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoletoPayment = async (data: any) => {
    setIsLoading(true);
    try {
      await onRequestPayment('BOLETO', data);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-[#1f1f1f] dark:border-[#262626]">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Nova Solicitação de Pagamento</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pix" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-[#262626]">
            <TabsTrigger value="pix" className="dark:data-[state=active]:bg-[#1a1a1a] dark:text-white">PIX</TabsTrigger>
            <TabsTrigger value="boleto" className="dark:data-[state=active]:bg-[#1a1a1a] dark:text-white">Boleto</TabsTrigger>
          </TabsList>

          <TabsContent value="pix" className="mt-4">
            <PixPaymentForm
              clientBalance={clientBalance}
              pixKeys={pixKeys}
              onSubmit={handlePixPayment}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="boleto" className="mt-4">
            <BoletoPaymentForm
              clientBalance={clientBalance}
              onSubmit={handleBoletoPayment}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
