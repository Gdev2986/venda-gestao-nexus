
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format-utils";

export interface ClientPaymentData {
  type: string;
  installments: number;
  totalAmount: number;
  salesCount: number;
}

interface ClientPaymentTypesTableProps {
  data: ClientPaymentData[];
  isLoading?: boolean;
  period?: string;
}

const ClientPaymentTypesTable = ({ data, isLoading = false, period }: ClientPaymentTypesTableProps) => {
  // Group by payment type for totals
  const paymentTypeTotals = data.reduce((acc: Record<string, { total: number, count: number }>, item) => {
    if (!acc[item.type]) {
      acc[item.type] = { total: 0, count: 0 };
    }
    acc[item.type].total += item.totalAmount;
    acc[item.type].count += item.salesCount;
    return acc;
  }, {});

  // Calculate overall totals
  const overallTotal = data.reduce(
    (acc, item) => {
      acc.amount += item.totalAmount;
      acc.count += item.salesCount;
      return acc;
    },
    { amount: 0, count: 0 }
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Vendas por Tipo de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : data.length > 0 ? (
                <>
                  {/* Regular data rows */}
                  {data.map((item, idx) => (
                    <TableRow key={idx} className="text-sm">
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.installments}x</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                      <TableCell className="text-right">{item.salesCount}</TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Payment type subtotals */}
                  {Object.entries(paymentTypeTotals).map(([type, data]) => (
                    <TableRow key={`total-${type}`} className="bg-muted/50 text-sm">
                      <TableCell className="font-medium">Total {type}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(data.total)}</TableCell>
                      <TableCell className="text-right font-medium">{data.count}</TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Grand total */}
                  <TableRow className="bg-primary/10 font-bold text-sm">
                    <TableCell>Total Geral</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">{formatCurrency(overallTotal.amount)}</TableCell>
                    <TableCell className="text-right">{overallTotal.count}</TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-sm text-muted-foreground">
                    Nenhuma venda registrada {period ? `neste ${period}` : ""}
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

export default ClientPaymentTypesTable;
