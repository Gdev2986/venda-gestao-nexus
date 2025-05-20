
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface PaymentTypeData {
  type: string;
  installments: number;
  totalAmount: number;
  salesCount: number;
}

interface PaymentTypesTableProps {
  data: PaymentTypeData[];
  isLoading?: boolean;
  dateRange?: { from: Date; to?: Date };
}

const PaymentTypesTable = ({ data, isLoading = false, dateRange }: PaymentTypesTableProps) => {
  // Group data by payment type for summary calculations
  const summaryByType = useMemo(() => {
    const summary: Record<string, { totalAmount: number; salesCount: number }> = {};
    
    data.forEach((item) => {
      if (!summary[item.type]) {
        summary[item.type] = { totalAmount: 0, salesCount: 0 };
      }
      
      summary[item.type].totalAmount += item.totalAmount;
      summary[item.type].salesCount += item.salesCount;
    });
    
    return summary;
  }, [data]);
  
  // Calculate grand totals
  const grandTotal = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.amount += item.totalAmount;
        acc.count += item.salesCount;
        return acc;
      },
      { amount: 0, count: 0 }
    );
  }, [data]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Vendas por Tipo de Pagamento</CardTitle>
        <CardDescription>
          {dateRange?.from && (
            <>
              Período: {dateRange.from.toLocaleDateString('pt-BR')}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString('pt-BR')}`}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Tipo de Pagamento</TableHead>
                <TableHead className="w-[100px]">Parcelas</TableHead>
                <TableHead className="text-right w-[150px]">Valor Total</TableHead>
                <TableHead className="text-right w-[150px]">Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  </TableRow>
                ))
              ) : data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.installments}x</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                      <TableCell className="text-right">{item.salesCount}</TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Summary rows with type totals */}
                  {Object.entries(summaryByType).map(([type, { totalAmount, salesCount }]) => (
                    <TableRow key={`summary-${type}`} className="bg-muted/50">
                      <TableCell className="font-medium">Total {type}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalAmount)}</TableCell>
                      <TableCell className="text-right font-medium">{salesCount}</TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Grand total row */}
                  <TableRow className="bg-primary/10 font-bold">
                    <TableCell>Total Geral</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">{formatCurrency(grandTotal.amount)}</TableCell>
                    <TableCell className="text-right">{grandTotal.count}</TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Sem vendas registradas neste período
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTypesTable;
