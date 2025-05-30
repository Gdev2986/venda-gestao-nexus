
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Pagamento</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pix" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="boleto">Boleto</TabsTrigger>
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
