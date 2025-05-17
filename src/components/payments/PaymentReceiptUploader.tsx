
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentReceiptUploaderProps {
  paymentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentReceiptUploader({
  paymentId,
  onSuccess,
  onCancel
}: PaymentReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um arquivo para enviar."
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `receipt_${paymentId}_${timestamp}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('payment_receipts')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('payment_receipts')
        .getPublicUrl(filePath);
      
      // Update payment record with receipt URL
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({ 
          receipt_url: urlData.publicUrl,
          status: 'PAID',
          notes: notes || null
        })
        .eq('id', paymentId);
      
      if (updateError) {
        throw new Error(`Erro ao atualizar pagamento: ${updateError.message}`);
      }
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso."
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível enviar o comprovante."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="receipt">
          Comprovante de Pagamento
        </Label>
        <div className="mt-2">
          <Input
            id="receipt"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          {preview && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <img
                src={preview}
                alt="Prévia do comprovante"
                className="w-full h-auto max-h-[200px] object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">
          Observações (opcional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Adicione informações sobre o pagamento..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isUploading}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isUploading || !file}
        >
          {isUploading ? (
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
