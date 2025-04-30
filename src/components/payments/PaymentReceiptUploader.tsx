
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Payment } from "@/types";
import { Loader2 } from "lucide-react";

export interface PaymentReceiptUploaderProps {
  payment: Payment;
  onSubmit: (paymentId: string, approved: boolean, receiptUrl?: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function PaymentReceiptUploader({
  payment,
  onSubmit,
  isSubmitting
}: PaymentReceiptUploaderProps) {
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  // This is a mock function - in a real app, this would upload to Supabase storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, we'll use a FileReader to create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptUrl(event.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleApprove = async () => {
    if (!receiptUrl) {
      alert("Por favor, faça upload do comprovante primeiro.");
      return;
    }
    
    await onSubmit(payment.id, true, receiptUrl);
  };
  
  const handleReject = async () => {
    await onSubmit(payment.id, false);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="receipt" className="block mb-2">
          Comprovante de Pagamento
        </Label>
        <div className="space-y-2">
          <Input
            id="receipt"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
            disabled={isSubmitting}
          />
          {receiptUrl && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <img
                src={receiptUrl}
                alt="Prévia do comprovante"
                className="w-full h-auto max-h-[200px] object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes" className="block mb-2">
          Observações (opcional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Adicione informações sobre o pagamento..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={handleReject}
          disabled={isSubmitting}
        >
          Rejeitar
        </Button>
        <Button
          onClick={handleApprove}
          disabled={isSubmitting || !receiptUrl}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Comprovante"
          )}
        </Button>
      </div>
    </div>
  );
}
