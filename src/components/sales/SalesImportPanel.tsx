import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileUp, X, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NormalizedSale, detectSourceByHeaders, normalizeData, cleanCsvRow, normalizeText } from "@/utils/sales-processor";
import SalesPreviewPanel from "./SalesPreviewPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { createMachine, getAllMachines } from "@/services/machine.service";
import { MachineStatus } from "@/types/machine.types";

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
    setProcessedSales([]); // Clear previous data when new files are added
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
              let raw = values[i]?.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim();
              const headerNorm = h.toLowerCase().replace(/\s/g, '');
              if (headerNorm.includes('valor') || headerNorm.includes('total') || headerNorm.includes('parcela') || headerNorm.includes('quantidade') || headerNorm.includes('qtd')) {
                raw = raw.replace(',', '.').replace(/[^0-9.-]/g, '');
                obj[h] = raw && !isNaN(Number(raw)) ? Number(raw) : 0;
              } else {
                obj[h] = raw;
              }
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
  
  // Function to ensure machines exist for terminals
  const ensureMachinesExist = async (terminals: string[]): Promise<void> => {
    try {
      // Get existing machines
      const existingMachines = await getAllMachines();
      const existingTerminals = new Set(
        existingMachines.map(m => normalizeText(m.serial_number))
      );
      
      // Find terminals that need machine creation
      const newTerminals = terminals.filter(terminal => 
        terminal && !existingTerminals.has(normalizeText(terminal))
      );
      
      // Create machines for new terminals
      for (const terminal of newTerminals) {
        if (terminal.trim()) {
          try {
            await createMachine({
              serial_number: terminal,
              model: 'Importado via CSV',
              status: MachineStatus.STOCK,
              notes: `Criado automaticamente durante importação de vendas em ${new Date().toLocaleDateString('pt-BR')}`
            });
            console.log(`Machine created for terminal: ${terminal}`);
          } catch (error) {
            console.error(`Failed to create machine for terminal ${terminal}:`, error);
            // Continue processing other terminals even if one fails
          }
        }
      }
      
      if (newTerminals.length > 0) {
        toast({
          title: "Máquinas criadas",
          description: `${newTerminals.length} máquinas foram criadas automaticamente`
        });
      }
    } catch (error) {
      console.error('Error ensuring machines exist:', error);
      throw new Error('Falha ao verificar/criar máquinas: ' + (error instanceof Error ? error.message : String(error)));
    }
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
      
      // Extract unique terminals from all sales
      const terminals = [...new Set(allSales.map(sale => sale.terminal).filter(Boolean))];
      
      // Ensure machines exist for all terminals
      if (terminals.length > 0) {
        await ensureMachinesExist(terminals);
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
  
  // Helper function to convert payment type to enum
  const convertPaymentMethod = (paymentType: string): "CREDIT" | "DEBIT" | "PIX" => {
    const normalizedType = paymentType.toLowerCase();
    if (normalizedType.includes('crédito') || normalizedType.includes('credito')) {
      return 'CREDIT';
    } else if (normalizedType.includes('débito') || normalizedType.includes('debito')) {
      return 'DEBIT';
    } else {
      return 'PIX';
    }
  };
  
  // Function to insert sales in batch to Supabase
  const insertSalesBatch = async (sales: NormalizedSale[]) => {
    try {
      // Transform normalized sales to the database format
      const salesData = sales.map(sale => ({
        code: sale.id || `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        terminal: sale.terminal,
        gross_amount: sale.gross_amount,
        net_amount: sale.gross_amount * 0.97, // Simple calculation
        date: new Date().toISOString(), // Use current date for now
        payment_method: convertPaymentMethod(sale.payment_type),
        client_id: '00000000-0000-0000-0000-000000000000', // Placeholder, will need proper client association
      }));

      const { error } = await supabase
        .from('sales')
        .insert(salesData);

      if (error) throw error;
      
      return salesData;
    } catch (error) {
      console.error('Error inserting sales batch:', error);
      throw error;
    }
  };
  
  // Confirm and save the processed sales
  const confirmImport = async () => {
    setIsProcessing(true);
    try {
      await insertSalesBatch(processedSales);
      onSalesProcessed(processedSales);
      toast({
        title: "Dados confirmados",
        description: `${processedSales.length} registros foram importados com sucesso.`
      });
      setFiles([]);
      setProcessedSales([]);
      setErrors([]);
    } catch (error) {
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
              Aprovar e Inserir no Banco
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
