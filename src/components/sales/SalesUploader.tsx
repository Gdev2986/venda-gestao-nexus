
import { useState } from 'react';
import { FileUploader } from '@/components/payments/FileUploader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface SalesUploaderProps {
  onSubmit: (file: File) => Promise<void>;
  isUploading?: boolean;
  error?: string | null;
  successCount?: number;
  totalCount?: number;
}

export default function SalesUploader({
  onSubmit,
  isUploading = false,
  error = null,
  successCount = 0,
  totalCount = 0,
}: SalesUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleUpload = async () => {
    if (selectedFile) {
      await onSubmit(selectedFile);
    }
  };
  
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };
  
  const getUploadProgress = () => {
    if (totalCount === 0) return 0;
    return (successCount / totalCount) * 100;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Importar Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FileUploader
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            accept=".csv,.xlsx"
            label="Selecione um arquivo CSV ou Excel para importar"
          />
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando...</span>
                <span>{successCount} de {totalCount} registros</span>
              </div>
              <Progress value={getUploadProgress()} />
            </div>
          )}
          
          {error && (
            <div className="rounded-md p-3 bg-destructive/10 flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}
          
          {!isUploading && successCount > 0 && (
            <div className="rounded-md p-3 bg-green-50 flex items-start">
              <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-green-700">
                Importação concluída com sucesso! {successCount} registros importados.
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Importando..." : "Importar Vendas"}
        </Button>
      </CardFooter>
    </Card>
  );
}
