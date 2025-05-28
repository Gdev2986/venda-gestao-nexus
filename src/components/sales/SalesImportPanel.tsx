
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileUp, X, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale, detectSourceByHeaders, normalizeData, cleanCsvRow } from "@/utils/sales-processor";
import SalesPreviewPanel from "./SalesPreviewPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { insertSales } from "@/services/sales.service";

interface SalesImportPanelProps {
  onSalesProcessed: (sales: NormalizedSale[]) => void;
}

const SalesImportPanel = ({ onSalesProcessed }: SalesImportPanelProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSales, setProcessedSales] = useState<NormalizedSale[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setErrors([]);
    setProcessedSales([]);
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
  
  // Read CSV file using FileReader
  const readCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
          const headers = headerLine.split(';').map(h => h.trim());
          const data = lines.map(line => {
            const values = line.split(';');
            const obj: any = {};
            headers.forEach((h, i) => {
              // Remove apenas aspas duplas e simples, mantendo o valor como string
              // para que seja processado corretamente pela função toNumber() do sales-processor
              let raw = values[i]?.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
              obj[h] = raw || '';
            });
            return obj;
          });
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
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
          const cleanedData = data.map(cleanCsvRow);
          const { data: normalized, warnings } = normalizeData(cleanedData, source);
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
  const confirmImport = async () => {
    setIsProcessing(true);
    try {
      console.log('Starting database insertion...');
      await insertSales(processedSales);
      onSalesProcessed(processedSales);
      toast({
        title: "Dados confirmados",
        description: `${processedSales.length} registros foram importados com sucesso.`
      });
      setFiles([]);
      setProcessedSales([]);
      setErrors([]);
    } catch (error) {
      console.error('Error inserting into database:', error);
      toast({
        title: "Erro ao inserir no banco",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Cancel the import process
  const cancelImport = () => {
    setProcessedSales([]);
    setFiles([]);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <Card className="shadow-md rounded-lg border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Importar Dados de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Dropzone */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors bg-background
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
            
            <div className="flex justify-end">
              <Button
                disabled={files.length === 0 || isProcessing}
                onClick={processFiles}
                className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
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

      {/* Inline Preview Panel */}
      {processedSales.length > 0 && (
        <div className="space-y-4">
          <SalesPreviewPanel 
            sales={processedSales} 
            title="Pré-visualização dos dados importados"
          />
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              onClick={confirmImport}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isProcessing ? 'Inserindo no banco...' : 'Aprovar e Inserir no Banco'}
            </Button>
            <Button
              variant="outline"
              onClick={cancelImport}
              disabled={isProcessing}
              className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesImportPanel;
