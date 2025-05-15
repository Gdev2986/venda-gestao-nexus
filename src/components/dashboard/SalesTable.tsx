
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentMethod, Sale } from "@/types";
import { CreditCardIcon, EyeIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
}

const getPaymentMethodIcon = (method: string) => {
  // Ensure method is a valid PaymentMethod enum value or use a default
  const paymentMethod = Object.values(PaymentMethod).includes(method as PaymentMethod) 
    ? method as PaymentMethod
    : PaymentMethod.CREDIT;

  switch (paymentMethod) {
    case PaymentMethod.CREDIT:
      return <Badge variant="outline">Crédito</Badge>;
    case PaymentMethod.DEBIT:
      return <Badge variant="outline" className="border-success text-success">Débito</Badge>;
    case PaymentMethod.PIX:
      return <Badge variant="outline" className="border-warning text-warning">Pix</Badge>;
    default:
      return <Badge variant="outline">{method}</Badge>;
  }
};

const SalesTable = ({ sales, isLoading = false }: SalesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const filteredSales = sales.filter((sale) => 
    sale.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewSaleDetails = (saleId: string) => {
    toast({
      title: "Detalhes da venda",
      description: `Visualizando venda #${saleId}. Função ainda não implementada completamente.`,
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg">Histórico de Vendas</CardTitle>
          <CardDescription>Visualize suas vendas recentes</CardDescription>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código..."
            className="pl-9 w-full sm:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Terminal</TableHead>
                  <TableHead className="text-right">Valor Bruto</TableHead>
                  <TableHead className="text-right">Valor Líquido</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
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
                        }).format(sale.gross_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(sale.net_amount)}
                      </TableCell>
                      <TableCell>{getPaymentMethodIcon(sale.payment_method)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewSaleDetails(sale.id)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma venda encontrada. 
                      {searchTerm && " Tente uma busca diferente."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesTable;
