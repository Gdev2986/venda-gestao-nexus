
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileUp, X, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale, detectSourceByHeaders, normalizeData } from "@/utils/sales-processor";
import SalesPreviewPanel from "./SalesPreviewPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Ensure Papa Parse is loaded
declare const Papa: any;

interface SalesImportPanelProps {
  onSalesProcessed: (sales: NormalizedSale[]) => void;
}

const SalesImportPanel = ({ onSalesProcessed }: SalesImportPanelProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSales, setProcessedSales] = useState<NormalizedSale[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setErrors([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv', '.xls', '.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });
  
  // Read CSV file using Papa Parse
  const readCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        delimiter: ';', // Semicolon as delimiter
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log(`CSV processed: ${results.data.length} rows, columns: ${results.meta.fields ? results.meta.fields.length : 0}`);
          if (results.errors && results.errors.length > 0) {
            console.warn('Errors processing CSV:', results.errors);
          }
          resolve(results.data);
        },
        error: (error: any) => {
          console.error('Error processing CSV:', error);
          reject(error);
        }
      });
    });
  };
  
  // Process the uploaded files
  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um ou mais arquivos CSV para importar",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setErrors([]);
    const allSales: NormalizedSale[] = [];
    const newErrors: string[] = [];
    
    try {
      // Process each file
      for (const file of files) {
        try {
          console.log(`Processing file: ${file.name}`);
          
          // Read the CSV file
          const data = await readCSVFile(file);
          
          // Detect the source based on headers
          const source = detectSourceByHeaders(data);
          console.log(`Detected source: ${source}`);
          
          if (source === 'Desconhecido') {
            newErrors.push(`Arquivo ${file.name}: Formato não reconhecido`);
            continue;
          }
          
          // Normalize the data
          const { data: normalized, warnings } = normalizeData(data, source);
          console.log(`Normalized data: ${normalized.length} records`);
          
          if (warnings.length > 0) {
            warnings.forEach(w => {
              newErrors.push(`Arquivo ${file.name}, linha ${w.rowIndex + 1}: ${w.message}`);
            });
          }
          
          // Add normalized data to the result
          allSales.push(...normalized);
          
        } catch (error) {
          newErrors.push(`Erro ao processar arquivo ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      // Update state with all processed sales
      setProcessedSales(allSales);
      
      if (allSales.length > 0) {
        setShowPreview(true);
        toast({
          title: "Importação concluída",
          description: `${allSales.length} registros foram processados com sucesso${newErrors.length ? `. ${newErrors.length} erros encontrados.` : '.'}`
        });
      } else {
        toast({
          title: "Falha na importação",
          description: "Nenhum dado válido foi encontrado nos arquivos",
          variant: "destructive"
        });
      }
      
      // Set any errors
      setErrors(newErrors);
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Erro ao processar arquivos",
        description: `Ocorreu um erro durante o processamento: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Confirm and save the processed sales
  const confirmImport = () => {
    onSalesProcessed(processedSales);
    toast({
      title: "Dados confirmados",
      description: `${processedSales.length} registros foram importados com sucesso.`
    });
    
    // Reset the import form
    setFiles([]);
    setProcessedSales([]);
    setShowPreview(false);
    setErrors([]);
  };
  
  // Cancel the import process
  const cancelImport = () => {
    setProcessedSales([]);
    setShowPreview(false);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Importar Dados de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Dropzone */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/50'}`}
            >
              <input {...getInputProps()} />
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              
              {isDragActive ? (
                <p>Solte os arquivos aqui...</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">Arraste arquivos CSV ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">
                    Suporta arquivos CSV da Rede, PagSeguro e Sigma
                  </p>
                </div>
              )}
            </div>
            
            {/* Selected Files */}
            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {files.length} {files.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
                      <div className="truncate text-sm">{file.name}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles(files.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button
                disabled={files.length === 0 || isProcessing}
                onClick={processFiles}
              >
                {isProcessing ? 'Processando...' : 'Processar Arquivos'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Errors Alert */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erros encontrados</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              {errors.slice(0, 5).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {errors.length > 5 && (
                <li>...e mais {errors.length - 5} erros</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Preview Panel */}
      {showPreview && processedSales.length > 0 && (
        <div className="space-y-4">
          <SalesPreviewPanel sales={processedSales} />
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={cancelImport}>
              Cancelar
            </Button>
            <Button onClick={confirmImport}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Importação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesImportPanel;
