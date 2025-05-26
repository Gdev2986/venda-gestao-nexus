
import { useState, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Upload, AlertCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NormalizedSale, detectSourceByHeaders, normalizeData } from "@/utils/sales-processor";
import { insertSales } from "@/services/sales.service";
import SalesPreviewPanel from "./SalesPreviewPanel";

interface SalesImportPanelProps {
  onSalesProcessed: (sales: NormalizedSale[]) => void;
}

const SalesImportPanel = ({ onSalesProcessed }: SalesImportPanelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<NormalizedSale[]>([]);
  const [warnings, setWarnings] = useState<Array<{rowIndex: number; message: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo CSV válido.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setProcessedData([]);
      setWarnings([]);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo CSV primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (results) => {
          try {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }

            const data = results.data as Array<Record<string, any>>;
            
            if (!data || data.length === 0) {
              throw new Error('Arquivo CSV vazio ou inválido');
            }

            const source = detectSourceByHeaders(data);
            const normalizeResult = normalizeData(data, source);
            
            setProcessedData(normalizeResult.data);
            setWarnings(normalizeResult.warnings);
            
            toast({
              title: "Arquivo processado com sucesso",
              description: `${normalizeResult.data.length} registros processados. Origem detectada: ${source}`,
            });
          } catch (error) {
            console.error('Error processing data:', error);
            toast({
              title: "Erro ao processar arquivo",
              description: error instanceof Error ? error.message : 'Erro desconhecido',
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: "Erro ao analisar CSV",
            description: "Verifique se o arquivo está no formato correto.",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Erro ao ler arquivo",
        description: "Não foi possível ler o arquivo selecionado.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (processedData.length === 0) {
      toast({
        title: "Nenhum dado para importar",
        description: "Processe um arquivo primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await insertSales(processedData);
      
      toast({
        title: "Importação concluída",
        description: `${processedData.length} vendas importadas com sucesso. As vendas foram vinculadas às máquinas através dos terminais.`,
      });

      onSalesProcessed(processedData);
      
      // Reset state
      setFile(null);
      setProcessedData([]);
      setWarnings([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing sales:', error);
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setProcessedData([]);
    setWarnings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Vendas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">Arquivo CSV</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Selecionar Arquivo
              </Button>
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetImport}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={processFile}
              disabled={!file || isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Processar Arquivo
                </>
              )}
            </Button>

            {processedData.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                variant="default"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Importar {processedData.length} Registros
              </Button>
            )}
          </div>

          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {warnings.length} avisos encontrados durante o processamento. 
                Verifique os dados antes de importar. As vendas serão vinculadas automaticamente às máquinas através dos números de terminal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {processedData.length > 0 && (
        <SalesPreviewPanel 
          sales={processedData}
          title="Pré-visualização dos Dados Importados"
        />
      )}
    </div>
  );
};

export default SalesImportPanel;
