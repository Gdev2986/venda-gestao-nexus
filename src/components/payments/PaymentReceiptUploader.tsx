
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentReceiptUploaderProps {
  paymentId: string;
  onSuccess: () => void;
}

export function PaymentReceiptUploader({ paymentId, onSuccess }: PaymentReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Arquivo não selecionado",
        description: "Selecione um arquivo para anexar.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload the file to Supabase Storage
      const filePath = `payments/${paymentId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Não foi possível obter a URL pública do comprovante");
      }

      // Update the payment record with the receipt URL
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({ receipt_url: urlData.publicUrl })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      toast({
        title: "Comprovante anexado",
        description: "O comprovante foi anexado com sucesso.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha ao anexar comprovante.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="receipt" className="mb-2 block">
          Anexar comprovante de pagamento
        </Label>
        <Input
          id="receipt"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Formatos aceitos: PDF, PNG, JPG até 5MB
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isUploading}
        >
          Cancelar
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
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
