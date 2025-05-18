
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export interface PaymentReceiptViewerProps {
  receiptUrl: string;
}

export function PaymentReceiptViewer({ receiptUrl }: PaymentReceiptViewerProps) {
  const handleOpenInNewTab = () => {
    window.open(receiptUrl, '_blank', 'noopener,noreferrer');
  };

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(receiptUrl);
  const isPdf = /\.pdf$/i.test(receiptUrl);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Comprovante de Pagamento</h3>
        <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir em nova aba
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        {isImage ? (
          <img 
            src={receiptUrl} 
            alt="Comprovante de Pagamento" 
            className="w-full max-h-[500px] object-contain"
          />
        ) : isPdf ? (
          <div className="p-4 flex flex-col items-center justify-center bg-muted h-[300px]">
            <p className="text-muted-foreground mb-2">Arquivo PDF</p>
            <Button variant="secondary" size="sm" onClick={handleOpenInNewTab}>
              Visualizar PDF
            </Button>
          </div>
        ) : (
          <div className="p-4 flex items-center justify-center bg-muted h-[300px]">
            <p className="text-muted-foreground">
              Comprovante não pode ser exibido. Clique em "Abrir em nova aba" para visualizar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
