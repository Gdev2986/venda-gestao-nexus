
import { useState, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Filter, Download, RefreshCw, Plus, Eye } from "lucide-react";
import SalesDropzone from "@/components/sales/SalesDropzone";
import SalesFiltersPanel from "@/components/sales/SalesFiltersPanel";
import SalesTable from "@/components/sales/SalesTable";
import ProcessedDataPreview from "@/components/sales/ProcessedDataPreview";
import { StyledCard } from "@/components/ui/styled-card";
import { generateMockSalesData } from "@/utils/sales-utils";
import { 
  detectSourceByHeaders, 
  normalizeData,
  getSalesMetadata,
} from "@/utils/sales-processor";
import { Sale } from "@/types";

// Types for normalized sales data
export interface NormalizedSale {
  id?: string;
  status: string;
  payment_type: string;
  gross_amount: number;
  transaction_date: string | Date;
  installments: number;
  terminal: string;
  brand: string;
  source: string;
}

// Types for filter state
export interface SalesFilters {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  paymentType: string[];
  status: string[];
  terminals: string[];
  brands: string[];
}

// Default filters
const defaultFilters: SalesFilters = {
  dateRange: {
    from: null,
    to: null,
  },
  paymentType: [],
  status: [],
  terminals: [],
  brands: [],
};

const AdminSales = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processedData, setProcessedData] = useState<NormalizedSale[]>([]);
  const [filteredData, setFilteredData] = useState<NormalizedSale[]>([]);
  const [recentlyProcessed, setRecentlyProcessed] = useState<NormalizedSale[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState<SalesFilters>(defaultFilters);
  const [filtersMeta, setFiltersMeta] = useState<{
    paymentTypes: string[];
    statuses: string[];
    terminals: string[];
    brands: string[];
  }>({ paymentTypes: [], statuses: [], terminals: [], brands: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;
  const { toast } = useToast();

  // Load mock data initially
  useEffect(() => {
    setIsLoading(true);
    const mockData = generateMockSalesData(50);
    setProcessedData(mockData);
    
    // Extract metadata for filters
    const metadata = getSalesMetadata(mockData);
    setFiltersMeta(metadata);
    
    setIsLoading(false);
  }, []);

  // Apply filters whenever filters or data changes
  useEffect(() => {
    let result = [...processedData];

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(sale => {
        const saleDate = new Date(sale.transaction_date);
        
        if (filters.dateRange.from && filters.dateRange.to) {
          return saleDate >= filters.dateRange.from && saleDate <= filters.dateRange.to;
        } else if (filters.dateRange.from) {
          return saleDate >= filters.dateRange.from;
        } else if (filters.dateRange.to) {
          return saleDate <= filters.dateRange.to;
        }
        return true;
      });
    }

    // Filter by payment type
    if (filters.paymentType.length > 0) {
      result = result.filter(sale => filters.paymentType.includes(sale.payment_type));
    }

    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter(sale => filters.status.includes(sale.status));
    }

    // Filter by terminals
    if (filters.terminals.length > 0) {
      result = result.filter(sale => filters.terminals.includes(sale.terminal));
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter(sale => filters.brands.includes(sale.brand));
    }

    setFilteredData(result);
    
    // Calculate pagination
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, processedData]);

  // Convert NormalizedSale to Sale for the SalesTable component
  const convertToSaleType = (normalizedSales: NormalizedSale[]): Sale[] => {
    return normalizedSales.map(sale => {
      return {
        id: sale.id || "",
        code: sale.id || "",
        terminal: sale.terminal,
        client_name: "Cliente", // Default value
        gross_amount: sale.gross_amount,
        net_amount: sale.gross_amount * 0.97, // 3% fee as an example
        date: typeof sale.transaction_date === 'string' 
          ? sale.transaction_date 
          : sale.transaction_date.toISOString(),
        payment_method: sale.payment_type.toLowerCase().includes('crédito') 
          ? "credit" 
          : sale.payment_type.toLowerCase().includes('débito') 
            ? "debit" 
            : "pix",
        client_id: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: sale.status,
      };
    });
  };

  // Process uploaded CSV files
  const handleFilesProcessed = useCallback((normalizedData: NormalizedSale[], warnings: any[]) => {
    setIsUploading(false);
    
    if (normalizedData.length === 0) {
      toast({
        title: "Sem dados para processar",
        description: "Nenhum dado válido foi encontrado nos arquivos.",
        variant: "destructive"
      });
      return;
    }
    
    // Set recently processed data for the preview
    setRecentlyProcessed(normalizedData);
    
    // Show the preview automatically
    setShowPreview(true);
    
    // Combine with existing data or replace
    const allData = [...processedData, ...normalizedData];
    setProcessedData(allData);
    
    // Update filter metadata
    const metadata = getSalesMetadata(allData);
    setFiltersMeta(metadata);
    
    toast({
      title: "Processamento concluído",
      description: `${normalizedData.length} registros foram processados com sucesso. ${warnings.length ? `${warnings.length} avisos encontrados.` : ''}`,
    });
  }, [processedData, toast]);

  // Handle CSV file upload
  const handleFileUpload = useCallback((files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    toast({
      title: "Processando arquivos",
      description: `${files.length} arquivos sendo processados...`,
    });
    
    // Process files one by one
    const processedResults: NormalizedSale[] = [];
    const warnings: any[] = [];
    
    // Use PapaParse to parse CSV files asynchronously
    const processFile = async (file: File): Promise<void> => {
      return new Promise((resolve) => {
        // Using Papa Parse to parse CSV
        const Papa = require('papaparse');
        Papa.parse(file, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (results: any) => {
            // Skip if no results
            if (!results.data || results.data.length === 0) {
              warnings.push({
                file: file.name,
                message: "Arquivo vazio ou com formato inválido"
              });
              resolve();
              return;
            }
            
            try {
              // Detect the source of the file
              const source = detectSourceByHeaders(results.meta.fields);
              
              if (source === "Desconhecido") {
                warnings.push({
                  file: file.name,
                  message: "Formato de arquivo não reconhecido"
                });
                resolve();
                return;
              }
              
              // Normalize data based on detected source
              const normalized = normalizeData(results.data, source);
              processedResults.push(...normalized.data);
              
              if (normalized.warnings.length > 0) {
                warnings.push(...normalized.warnings.map(w => ({
                  file: file.name,
                  ...w
                })));
              }
              
              resolve();
            } catch (error) {
              warnings.push({
                file: file.name,
                message: `Erro ao processar: ${error}`
              });
              resolve();
            }
          },
          error: (error: any) => {
            warnings.push({
              file: file.name,
              message: `Erro ao analisar CSV: ${error}`
            });
            resolve();
          }
        });
      });
    };
    
    // Process all files in sequence
    const processAllFiles = async () => {
      for (let i = 0; i < files.length; i++) {
        await processFile(files[i]);
      }
      
      // When all files are processed, update the state
      handleFilesProcessed(processedResults, warnings);
    };
    
    processAllFiles();
  }, [handleFilesProcessed, toast]);

  // Export filtered data as CSV
  const handleExport = useCallback(() => {
    if (filteredData.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Aplique filtros diferentes ou importe dados.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare headers
    const headers = [
      "Status",
      "Tipo de Pagamento",
      "Valor Bruto",
      "Data de Transação",
      "Parcelas",
      "Terminal",
      "Bandeira",
      "Origem"
    ];
    
    // Convert data to CSV rows
    const rows = filteredData.map(sale => [
      sale.status,
      sale.payment_type,
      String(sale.gross_amount).replace(".", ","),
      typeof sale.transaction_date === 'string' 
        ? sale.transaction_date
        : new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(sale.transaction_date),
      sale.installments,
      sale.terminal,
      sale.brand,
      sale.source
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    // Add BOM for UTF-8 encoding
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    // Create downloadable link
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    link.download = `Relatorio_${dateStr}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: `${filteredData.length} registros exportados para CSV.`,
    });
  }, [filteredData, toast]);

  // Refresh data (for real implementation, this would fetch from API)
  const handleRefresh = () => {
    setIsLoading(true);
    
    // For demo, we'll regenerate mock data
    setTimeout(() => {
      const mockData = generateMockSalesData(50);
      setProcessedData(mockData);
      
      // Extract metadata for filters
      const metadata = getSalesMetadata(mockData);
      setFiltersMeta(metadata);
      
      setIsLoading(false);
      
      toast({
        title: "Dados atualizados",
        description: "Novos dados foram carregados.",
      });
    }, 500);
  };

  // Calculate current page data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats
  const totalGrossAmount = filteredData.reduce((sum, sale) => sum + sale.gross_amount, 0);
  
  // Convert filtered data to Sale type for the SalesTable component
  const tableData = convertToSaleType(currentData);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vendas"
        description="Importação e gestão de vendas"
        action={
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={filteredData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        }
      />
      
      {/* Upload Area */}
      <StyledCard borderColor="border-primary/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Importar dados de vendas</h2>
          <SalesDropzone 
            onFilesAccepted={handleFileUpload} 
            isUploading={isUploading}
          />
          
          {/* Preview Button - Only show if recently processed data exists */}
          {recentlyProcessed.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Preview de Dados Processados
              </Button>
            </div>
          )}
        </div>
      </StyledCard>
      
      {/* Data Preview Modal/Sheet */}
      <ProcessedDataPreview 
        data={recentlyProcessed}
        isOpen={showPreview}
        onOpenChange={setShowPreview}
      />
      
      {/* Filters Panel - Conditionally rendered */}
      {showFilters && (
        <StyledCard borderColor="border-gray-200">
          <div className="p-6">
            <SalesFiltersPanel 
              filters={filters}
              setFilters={setFilters}
              metadata={filtersMeta}
              onClearFilters={() => setFilters(defaultFilters)}
            />
          </div>
        </StyledCard>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StyledCard borderColor="border-green-500">
          <div className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Bruto</h3>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalGrossAmount)}
            </div>
          </div>
        </StyledCard>
        
        <StyledCard borderColor="border-blue-500">
          <div className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Transações</h3>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </div>
        </StyledCard>
      </div>
      
      {/* Data Table */}
      <StyledCard borderColor="border-gray-200">
        <div className="p-6">
          <SalesTable 
            data={tableData}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </StyledCard>
    </div>
  );
};

export default AdminSales;
