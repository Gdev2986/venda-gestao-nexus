
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentReceiptUploaderProps {
  paymentId: string;
  onUploadComplete: (url: string) => void;
}

export default function PaymentReceiptUploader({ 
  paymentId, 
  onUploadComplete 
}: PaymentReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if file is an image
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor envie apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    // Create preview URL for the selected image
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const uploadReceipt = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      // Generate a unique filename with the original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${paymentId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(filePath);
      
      // Notify parent component of successful upload
      onUploadComplete(publicUrl);
      
      toast({
        title: "Comprovante enviado",
        description: "O comprovante foi enviado com sucesso.",
      });
      
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erro ao enviar comprovante",
        description: error.message || "Ocorreu um erro ao enviar o comprovante.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="receipt">Comprovante de Pagamento</Label>
        {!file && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground/70 mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste uma imagem ou clique para enviar
            </p>
            <p className="text-xs text-muted-foreground/70">
              Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
            </p>
            <input
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}

        {previewUrl && (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-auto rounded-md max-h-64 object-contain border" 
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Button 
        onClick={uploadReceipt} 
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Enviando...
          </>
        ) : (
          "Enviar Comprovante"
        )}
      </Button>
    </div>
  );
}
