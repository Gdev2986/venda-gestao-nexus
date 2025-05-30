import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileUp, X, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale, detectSourceByHeaders, normalizeData, cleanCsvRow } from "@/utils/sales-processor";
import SalesPreviewPanel from "./SalesPreviewPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { insertSalesOptimized } from "@/services/sales/optimized-insert";
import { Progress } from "@/components/ui/progress";

interface SalesImportPanelProps {
  onSalesProcessed: (sales: NormalizedSale[]) => void;
}

const SalesImportPanel = ({ onSalesProcessed }: SalesImportPanelProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSales, setProcessedSales] = useState<NormalizedSale[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [insertProgress, setInsertProgress] = useState(0);
  const [isInserting, setIsInserting] = useState(false);
  const [insertedCount, setInsertedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setErrors([]);
    setProcessedSales([]);
    setInsertProgress(0);
    setInsertedCount(0);
    setTotalCount(0);
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
      for (const file of files) {
        try {
          console.log(`Processing file: ${file.name}`);
          
          const data = await readCSVFile(file);
          const source = detectSourceByHeaders(data);
          console.log(`Detected source: ${source}`);
          
          if (source === 'Desconhecido') {
            newErrors.push(`Arquivo ${file.name}: Formato não reconhecido`);
            continue;
          }
          
          const cleanedData = data.map(cleanCsvRow);
          const { data: normalized, warnings } = normalizeData(cleanedData, source);
          console.log(`Normalized data: ${normalized.length} records`);
          
          if (warnings.length > 0) {
            warnings.forEach(w => {
              newErrors.push(`Arquivo ${file.name}, linha ${w.rowIndex + 1}: ${w.message}`);
            });
          }
          
          allSales.push(...normalized);
          
        } catch (error) {
          newErrors.push(`Erro ao processar arquivo ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
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
  
  // Confirm and save with real progress tracking
  const confirmImport = async () => {
    setIsInserting(true);
    setInsertProgress(0);
    setInsertedCount(0);
    setTotalCount(processedSales.length);
    
    try {
      console.log('Starting optimized database insertion with real progress...');
      
      // Use optimized insertion with real progress callback
      await insertSalesOptimized(processedSales, (completed, total, percentage) => {
        setInsertedCount(completed);
        setTotalCount(total);
        setInsertProgress(percentage);
      });
      
      onSalesProcessed(processedSales);
      toast({
        title: "Dados confirmados",
        description: `${processedSales.length} registros foram importados com sucesso usando inserção otimizada (batch size: 300).`
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
      setIsInserting(false);
      setInsertProgress(0);
      setInsertedCount(0);
      setTotalCount(0);
    }
  };
  
  const cancelImport = () => {
    setProcessedSales([]);
    setFiles([]);
    setErrors([]);
    setInsertProgress(0);
    setInsertedCount(0);
    setTotalCount(0);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <Card className="shadow-md rounded-lg border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Importar Dados de Vendas (Otimizado - Batch 300)</CardTitle>
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
                    Suporta arquivos CSV da Rede, PagSeguro e Sigma (batch otimizado de 300 registros)
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
            title="Pré-visualização dos dados importados (batch otimizado 300)"
          />
          
          {/* Real Progress bar during insertion */}
          {isInserting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Inserindo no banco de dados... (Batch: 300 registros)</span>
                <span>{insertProgress}% ({insertedCount.toLocaleString()}/{totalCount.toLocaleString()})</span>
              </div>
              <Progress value={insertProgress} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">
                Processados: {insertedCount.toLocaleString()} de {totalCount.toLocaleString()} registros
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              onClick={confirmImport}
              disabled={isProcessing || isInserting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isInserting ? `Inserindo... ${insertProgress}%` : 'Aprovar e Inserir no Banco (Batch 300)'}
            </Button>
            <Button
              variant="outline"
              onClick={cancelImport}
              disabled={isProcessing || isInserting}
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
