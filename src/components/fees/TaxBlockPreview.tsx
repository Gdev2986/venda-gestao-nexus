
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Eye, Settings } from "lucide-react";
import { BlockWithRates } from "@/services/tax-blocks.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaxBlockPreviewProps {
  block: BlockWithRates;
  onEdit: () => void;
}

interface ColumnVisibility {
  paymentMethod: boolean;
  installment: boolean;
  rootRate: boolean;
  forwardingRate: boolean;
  finalRate: boolean;
}

const TaxBlockPreview: React.FC<TaxBlockPreviewProps> = ({ block, onEdit }) => {
  const [showAllCredit, setShowAllCredit] = useState(false);
  const [columns, setColumns] = useState<ColumnVisibility>({
    paymentMethod: true,
    installment: true,
    rootRate: false,
    forwardingRate: false,
    finalRate: true,
  });

  const rates = block.rates || [];
  
  // Separar taxas por método de pagamento
  const debitRates = rates.filter(r => r.payment_method === 'DEBIT');
  const pixRates = rates.filter(r => r.payment_method === 'PIX');
  const creditRates = rates.filter(r => r.payment_method === 'CREDIT').sort((a, b) => a.installment - b.installment);
  
  // Mostrar apenas até 12x inicialmente, depois expandir para 21x
  const displayedCreditRates = showAllCredit ? creditRates : creditRates.slice(0, 12);
  
  // Combinar todas as taxas para exibição em uma única tabela
  const allDisplayedRates = [
    ...debitRates,
    ...pixRates,
    ...displayedCreditRates
  ].sort((a, b) => {
    // Ordenar por método de pagamento primeiro, depois por parcelas
    const methodOrder = { 'DEBIT': 1, 'PIX': 2, 'CREDIT': 3 };
    const methodA = methodOrder[a.payment_method as keyof typeof methodOrder] || 99;
    const methodB = methodOrder[b.payment_method as keyof typeof methodOrder] || 99;
    
    if (methodA !== methodB) {
      return methodA - methodB;
    }
    
    return a.installment - b.installment;
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CREDIT': return 'Crédito';
      case 'DEBIT': return 'Débito';
      case 'PIX': return 'PIX';
      default: return method;
    }
  };

  const getPaymentMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'CREDIT': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700';
      case 'DEBIT': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'PIX': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const formatRate = (rate: number) => `${rate.toFixed(2)}%`;

  return (
    <Card className="w-full border-border dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">{block.name}</CardTitle>
          {block.description && (
            <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Seletor de colunas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Exibir Colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                <Checkbox
                  id="method"
                  checked={columns.paymentMethod}
                  onCheckedChange={() => toggleColumn('paymentMethod')}
                />
                <label htmlFor="method" className="text-sm cursor-pointer">Método de Pagamento</label>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                <Checkbox
                  id="installment"
                  checked={columns.installment}
                  onCheckedChange={() => toggleColumn('installment')}
                />
                <label htmlFor="installment" className="text-sm cursor-pointer">Parcelas</label>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                <Checkbox
                  id="rootRate"
                  checked={columns.rootRate}
                  onCheckedChange={() => toggleColumn('rootRate')}
                />
                <label htmlFor="rootRate" className="text-sm cursor-pointer">Taxa Raíz</label>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                <Checkbox
                  id="forwardingRate"
                  checked={columns.forwardingRate}
                  onCheckedChange={() => toggleColumn('forwardingRate')}
                />
                <label htmlFor="forwardingRate" className="text-sm cursor-pointer">Taxa de Repasse</label>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
                <Checkbox
                  id="finalRate"
                  checked={columns.finalRate}
                  onCheckedChange={() => toggleColumn('finalRate')}
                />
                <label htmlFor="finalRate" className="text-sm cursor-pointer">Taxa Final</label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Settings className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {allDisplayedRates.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="border-border dark:border-gray-700">
                  {columns.paymentMethod && <TableHead className="text-foreground">Método</TableHead>}
                  {columns.installment && <TableHead className="text-foreground">Parcelas</TableHead>}
                  {columns.rootRate && <TableHead className="text-foreground">Taxa Raíz</TableHead>}
                  {columns.forwardingRate && <TableHead className="text-foreground">Taxa de Repasse</TableHead>}
                  {columns.finalRate && <TableHead className="text-foreground">Taxa Final</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allDisplayedRates.map((rate, index) => (
                  <TableRow key={`${rate.payment_method}-${rate.installment}-${index}`} className="border-border dark:border-gray-700 hover:bg-muted/50">
                    {columns.paymentMethod && (
                      <TableCell>
                        <Badge variant="outline" className={getPaymentMethodBadgeColor(rate.payment_method)}>
                          {getPaymentMethodLabel(rate.payment_method)}
                        </Badge>
                      </TableCell>
                    )}
                    {columns.installment && <TableCell className="text-foreground">{rate.installment}x</TableCell>}
                    {columns.rootRate && <TableCell className="text-foreground">{formatRate(rate.root_rate)}</TableCell>}
                    {columns.forwardingRate && <TableCell className="text-foreground">{formatRate(rate.forwarding_rate)}</TableCell>}
                    {columns.finalRate && <TableCell className="font-medium text-foreground">{formatRate(rate.final_rate)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {creditRates.length > 12 && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCredit(!showAllCredit)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showAllCredit ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Ver mais ({creditRates.length - 12} parcelas restantes)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma taxa configurada</p>
            <Button variant="outline" size="sm" onClick={onEdit} className="mt-2">
              Configurar Taxas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxBlockPreview;
