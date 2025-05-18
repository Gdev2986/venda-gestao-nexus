
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentReceiptUploaderProps {
  paymentId: string;
  onSuccess: (url: string) => void;
}

export function PaymentReceiptUploader({ paymentId, onSuccess }: PaymentReceiptUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um comprovante para enviar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${paymentId}_${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('payment_receipts')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment_receipts')
        .getPublicUrl(filePath);
        
      // Update the payment record with the receipt URL
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({ 
          receipt_url: publicUrl,
          status: "PAID" // Update status to PAID
        })
        .eq('id', paymentId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso."
      });
      
      onSuccess(publicUrl);
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      toast({
        title: "Erro ao enviar comprovante",
        description: error.message || "Não foi possível enviar o comprovante.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="receipt" className="text-sm font-medium">
          Comprovante de Pagamento (PDF, JPG ou PNG)
        </label>
        
        <div className="flex items-center space-x-2">
          <input
            id="receipt"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20"
            disabled={isUploading}
          />
        </div>
        
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Arquivo selecionado: {selectedFile.name}
          </p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Comprovante
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
