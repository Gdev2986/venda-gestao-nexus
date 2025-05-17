
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Download } from "lucide-react";

interface PaymentReceiptViewerProps {
  url: string;
}

export function PaymentReceiptViewer({ url }: PaymentReceiptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!url) return null;

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
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
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Baixar
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.open(url, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Abrir
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <img
            src={url}
            alt="Comprovante de pagamento"
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
