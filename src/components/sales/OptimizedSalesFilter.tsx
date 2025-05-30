
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { SalesFilters } from "@/services/optimized-sales.service";
import TerminalFilter from "./TerminalFilter";

interface OptimizedSalesFilterProps {
  filters: SalesFilters;
  availableDates: string[];
  onFiltersChange: (filters: Partial<SalesFilters>) => void;
  onResetFilters: () => void;
}

const OptimizedSalesFilter = ({ 
  filters, 
  availableDates, 
  onFiltersChange, 
  onResetFilters 
}: OptimizedSalesFilterProps) => {
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>(filters.terminals || []);

  // Atualizar filtro de terminais quando seleção muda
  useEffect(() => {
    onFiltersChange({ terminals: selectedTerminals.length > 0 ? selectedTerminals : undefined });
  }, [selectedTerminals, onFiltersChange]);

  // Sincronizar com filtros externos (quando limpar filtros)
  useEffect(() => {
    if (!filters.terminals || filters.terminals.length === 0) {
      setSelectedTerminals([]);
    } else {
      setSelectedTerminals(filters.terminals);
    }
  }, [filters.terminals]);

  const hasActiveFilters = 
    filters.paymentType || 
    filters.source || 
    filters.brand ||
    (filters.terminals && filters.terminals.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Adicionais de Vendas
          {hasActiveFilters && (
            <span className="text-sm font-normal text-muted-foreground">
              ({Object.keys(filters).filter(key => filters[key as keyof SalesFilters] !== undefined).length} filtros ativos)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primeira linha: Tipo de Pagamento | Bandeira | Origem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Tipo de Pagamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Pagamento</label>
            <Select 
              value={filters.paymentType || "all"} 
              onValueChange={(value) => onFiltersChange({ paymentType: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                <SelectItem value="PIX">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Bandeira */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bandeira</label>
            <Select 
              value={filters.brand || "all"} 
              onValueChange={(value) => onFiltersChange({ brand: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="Elo">Elo</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Origem */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Origem</label>
            <Select 
              value={filters.source || "all"} 
              onValueChange={(value) => onFiltersChange({ source: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="PagSeguro">PagSeguro</SelectItem>
                <SelectItem value="PagBank">PagBank</SelectItem>
                <SelectItem value="Getnet">Getnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda linha: Terminais e botão limpar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <TerminalFilter
              selectedTerminals={selectedTerminals}
              onTerminalsChange={setSelectedTerminals}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium invisible">Ações</label>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTerminals([]);
                  onResetFilters();
                }}
                className="w-full flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground space-y-1 border-t pt-3">
            <div><strong>Filtros ativos:</strong></div>
            {filters.paymentType && (
              <div>• Pagamento: {filters.paymentType === 'CREDIT' ? 'Cartão de Crédito' : filters.paymentType === 'DEBIT' ? 'Cartão de Débito' : 'Pix'}</div>
            )}
            {filters.brand && (
              <div>• Bandeira: {filters.brand}</div>
            )}
            {filters.source && (
              <div>• Origem: {filters.source}</div>
            )}
            {filters.terminals && filters.terminals.length > 0 && (
              <div>• Terminais: {filters.terminals.length} selecionados ({filters.terminals.slice(0, 3).join(', ')}{filters.terminals.length > 3 ? '...' : ''})</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesFilter;
