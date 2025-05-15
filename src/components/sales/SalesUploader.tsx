import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/payments/FileUploader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
interface SalesUploaderProps {
  onFileProcessed: (file: File, recordCount: number) => void;
}
const SalesUploader = ({
  onFileProcessed
}: SalesUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const {
    toast
  } = useToast();

  // Handle file selection
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setRecordCount(null);
    if (selectedFile) {
      // Simulate file parsing to get record count
      setTimeout(() => {
        // Generate random number of records between 50 and 500
        const count = Math.floor(Math.random() * 450) + 50;
        setRecordCount(count);
      }, 800);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) return;
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);

      // Invoke callback with file and record count
      if (recordCount) {
        onFileProcessed(file, recordCount);
      }

      // Reset state
      setFile(null);
      setRecordCount(null);
    }, 1500);
  };

  // Handle cancel
  const handleCancel = () => {
    setFile(null);
    setRecordCount(null);
  };
  return <Card className="h-full">
      <CardHeader className="my-0 py-[8px]">
        
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploader onFileSelect={handleFileSelect} accept=".csv,.xlsx,.xls" label="Arraste um arquivo CSV ou Excel ou clique para selecionar" currentFile={file} />
        
        {file && <div className="mt-4 space-y-3">
            <div className="text-sm">
              <p className="font-medium">Arquivo: {file.name}</p>
              {recordCount ? <p className="text-muted-foreground">
                  {recordCount} registros encontrados
                </p> : <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">
                    Analisando arquivo...
                  </span>
                </div>}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="default" className="flex-1" disabled={!recordCount || isProcessing} onClick={handleUpload}>
                {isProcessing ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </> : "Confirmar Upload"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCancel} disabled={isProcessing}>
                Cancelar
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground italic">
              Nota: Este é um upload simulado. A integração com backend será implementada futuramente.
            </p>
          </div>}
      </CardContent>
    </Card>;
};
export default SalesUploader;