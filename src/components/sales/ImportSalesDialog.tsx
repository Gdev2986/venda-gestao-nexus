
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";

interface ImportSalesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportSalesDialog = ({ open, onOpenChange }: ImportSalesDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Simulate file processing to determine number of records
    setIsProcessing(true);
    setTimeout(() => {
      // Generate a random number of records between 50 and 500
      const count = Math.floor(Math.random() * 450) + 50;
      setRecordCount(count);
      setIsProcessing(false);
    }, 1000);
  };
  
  const handleImport = () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      
      toast({
        title: "Importação concluída",
        description: `${recordCount} vendas foram importadas com sucesso.`
      });
      
      // Reset state
      setFile(null);
      setRecordCount(null);
    }, 2000);
  };

  const handleCancel = () => {
    setFile(null);
    setRecordCount(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Vendas</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV ou Excel contendo os dados de vendas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('sales-file')?.click()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 text-sm text-gray-600">
                <label htmlFor="sales-file" className="font-medium text-primary hover:underline cursor-pointer">
                  Clique para selecionar
                </label>{" "}
                ou arraste e solte
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Arquivos CSV, XLS ou XLSX até 10MB
              </p>
              <Input
                id="sales-file"
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground">
                    <UploadCloud className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                    {isProcessing ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Processando arquivo...
                      </div>
                    ) : recordCount ? (
                      <div className="text-sm text-muted-foreground">
                        {recordCount} registros encontrados
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || isProcessing || !recordCount}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Importar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportSalesDialog;
