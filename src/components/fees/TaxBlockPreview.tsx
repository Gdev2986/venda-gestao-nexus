
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

  const formatRate = (rate: number) => `${rate.toFixed(2)}%`;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">{block.name}</CardTitle>
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
      
      <CardContent className="space-y-6">
        {/* Débito */}
        {debitRates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Débito
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.paymentMethod && <TableHead>Método</TableHead>}
                  {columns.installment && <TableHead>Parcelas</TableHead>}
                  {columns.rootRate && <TableHead>Taxa Raíz</TableHead>}
                  {columns.forwardingRate && <TableHead>Taxa de Repasse</TableHead>}
                  {columns.finalRate && <TableHead>Taxa Final</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {debitRates.map((rate, index) => (
                  <TableRow key={`debit-${index}`}>
                    {columns.paymentMethod && <TableCell>Débito</TableCell>}
                    {columns.installment && <TableCell>{rate.installment}x</TableCell>}
                    {columns.rootRate && <TableCell>{formatRate(rate.root_rate)}</TableCell>}
                    {columns.forwardingRate && <TableCell>{formatRate(rate.forwarding_rate)}</TableCell>}
                    {columns.finalRate && <TableCell className="font-medium">{formatRate(rate.final_rate)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* PIX */}
        {pixRates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                PIX
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.paymentMethod && <TableHead>Método</TableHead>}
                  {columns.installment && <TableHead>Parcelas</TableHead>}
                  {columns.rootRate && <TableHead>Taxa Raíz</TableHead>}
                  {columns.forwardingRate && <TableHead>Taxa de Repasse</TableHead>}
                  {columns.finalRate && <TableHead>Taxa Final</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pixRates.map((rate, index) => (
                  <TableRow key={`pix-${index}`}>
                    {columns.paymentMethod && <TableCell>PIX</TableCell>}
                    {columns.installment && <TableCell>{rate.installment}x</TableCell>}
                    {columns.rootRate && <TableCell>{formatRate(rate.root_rate)}</TableCell>}
                    {columns.forwardingRate && <TableCell>{formatRate(rate.forwarding_rate)}</TableCell>}
                    {columns.finalRate && <TableCell className="font-medium">{formatRate(rate.final_rate)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Crédito */}
        {creditRates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Crédito
              </Badge>
              <span className="text-sm text-muted-foreground">
                Mostrando {displayedCreditRates.length} de {creditRates.length} parcelas
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.paymentMethod && <TableHead>Método</TableHead>}
                  {columns.installment && <TableHead>Parcelas</TableHead>}
                  {columns.rootRate && <TableHead>Taxa Raíz</TableHead>}
                  {columns.forwardingRate && <TableHead>Taxa de Repasse</TableHead>}
                  {columns.finalRate && <TableHead>Taxa Final</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedCreditRates.map((rate, index) => (
                  <TableRow key={`credit-${index}`}>
                    {columns.paymentMethod && <TableCell>Crédito</TableCell>}
                    {columns.installment && <TableCell>{rate.installment}x</TableCell>}
                    {columns.rootRate && <TableCell>{formatRate(rate.root_rate)}</TableCell>}
                    {columns.forwardingRate && <TableCell>{formatRate(rate.forwarding_rate)}</TableCell>}
                    {columns.finalRate && <TableCell className="font-medium">{formatRate(rate.final_rate)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {creditRates.length > 12 && (
              <div className="flex justify-center mt-4">
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
                      Ver mais ({creditRates.length - 12} restantes)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {rates.length === 0 && (
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
