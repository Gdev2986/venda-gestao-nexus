
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Eye } from "lucide-react";

interface PaymentReceiptViewerProps {
  receiptUrl: string;
}

export function PaymentReceiptViewer({ receiptUrl }: PaymentReceiptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Comprovante de Pagamento</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isExpanded ? "Ocultar" : "Visualizar"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={receiptUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              Baixar
            </a>
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border rounded overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {receiptUrl.endsWith('.pdf') ? (
            <iframe
              src={`${receiptUrl}#toolbar=0&navpanes=0`}
              className="w-full h-96"
              onLoad={() => setIsLoading(false)}
              title="Comprovante de Pagamento"
            />
          ) : (
            <img
              src={receiptUrl}
              alt="Comprovante de Pagamento"
              className="w-full max-h-96 object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
