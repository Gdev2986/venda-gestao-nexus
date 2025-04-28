import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaymentMethod, Sale, SalesFilterParams } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, DownloadIcon, SearchIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Mock data generator
const generateMockSales = (count = 50): Sale[] => {
  const sales: Sale[] = [];
  const terminals = ["T123456", "T789012", "T345678", "T901234"];
  const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
  
  for (let i = 0; i < count; i++) {
    const grossAmount = Math.random() * 1000;
    const netAmount = grossAmount * 0.97; // 3% fee
    
    sales.push({
      id: `sale_${i}`,
      code: `VND${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      grossAmount,
      netAmount,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      clientId: "client_1",
    });
  }
  
  // Sort by date, newest first
  return sales.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT:
      return <Badge variant="outline">Crédito</Badge>;
    case PaymentMethod.DEBIT:
      return <Badge variant="outline" className="border-success text-success">Débito</Badge>;
    case PaymentMethod.PIX:
      return <Badge variant="outline" className="border-warning text-warning">Pix</Badge>;
    default:
      return null;
  }
};

interface DateRange {
  from: Date;
  to?: Date;
}

const Sales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<SalesFilterParams>({});
  const [date, setDate] = useState<DateRange | undefined>();
  
  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSales = generateMockSales(50);
      setSales(mockSales);
      setFilteredSales(mockSales);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let result = [...sales];
    
    if (filters.paymentMethod) {
      result = result.filter(
        (sale) => sale.paymentMethod === filters.paymentMethod
      );
    }
    
    if (filters.terminal) {
      result = result.filter(
        (sale) => sale.terminal === filters.terminal
      );
    }
    
    if (filters.search) {
      result = result.filter(
        (sale) => sale.code.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (date?.from) {
      const startDate = new Date(date.from);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = date.to ? new Date(date.to) : new Date(date.from);
      endDate.setHours(23, 59, 59, 999);
      
      result = result.filter(
        (sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        }
      );
    }
    
    setFilteredSales(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, date, sales]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate totals
  const totals = filteredSales.reduce(
    (acc, sale) => {
      acc.grossAmount += sale.grossAmount;
      acc.netAmount += sale.netAmount;
      return acc;
    },
    { grossAmount: 0, netAmount: 0 }
  );
  
  const handleFilterChange = (key: keyof SalesFilterParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
    setDate(undefined);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todas as suas vendas
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as vendas por período, forma de pagamento, terminal e mais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(date.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  handleFilterChange("paymentMethod", value as PaymentMethod)
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value={PaymentMethod.CREDIT}>Crédito</SelectItem>
                  <SelectItem value={PaymentMethod.DEBIT}>Débito</SelectItem>
                  <SelectItem value={PaymentMethod.PIX}>Pix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terminal">Terminal</Label>
              <Select
                value={filters.terminal}
                onValueChange={(value) => handleFilterChange("terminal", value)}
              >
                <SelectTrigger id="terminal">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="T123456">T123456</SelectItem>
                  <SelectItem value="T789012">T789012</SelectItem>
                  <SelectItem value="T345678">T345678</SelectItem>
                  <SelectItem value="T901234">T901234</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Código da Venda</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por código..."
                  className="pl-9"
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Vendas</CardTitle>
            <div className="text-sm text-muted-foreground space-x-4">
              <span>Total Bruto: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.grossAmount)}</span>
              <span>Total Líquido: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.netAmount)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Terminal</TableHead>
                      <TableHead className="text-right">Valor Bruto</TableHead>
                      <TableHead className="text-right">Valor Líquido</TableHead>
                      <TableHead>Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.length > 0 ? (
                      paginatedSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.code}</TableCell>
                          <TableCell>
                            {format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell>{sale.terminal}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(sale.grossAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(sale.netAmount)}
                          </TableCell>
                          <TableCell>{getPaymentMethodLabel(sale.paymentMethod)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhuma venda encontrada. 
                          {Object.keys(filters).length > 0 && " Tente outros filtros."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredSales.length > 0 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, current page and pages around it
                        let pageNumber;
                        
                        if (totalPages <= 5) {
                          // If less than 5 pages, show all
                          pageNumber = i + 1;
                        } else if (page <= 3) {
                          // If near start, show first 5
                          pageNumber = i + 1;
                        } else if (page >= totalPages - 2) {
                          // If near end, show last 5
                          pageNumber = totalPages - 4 + i;
                        } else {
                          // Otherwise show around current page
                          pageNumber = page - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={pageNumber === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && page < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Sales;
