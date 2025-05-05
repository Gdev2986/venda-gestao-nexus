import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  ArrowUp, 
  ChevronsUpDown,
  RefreshCw,
  Copy
} from "lucide-react";
import { 
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PATHS } from "@/routes/paths";

interface DataTableProps {
  columns: ColumnDef<Payment>[];
  data: Payment[];
}

function DataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar pagamentos..."
          value={(table.getColumn("client_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("client_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => table.getColumn("status")?.setFilterValue(value)}
        >
          <SelectTrigger className="ml-4 w-[180px]">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="APPROVED">Aprovado</SelectItem>
            <SelectItem value="REJECTED">Rejeitado</SelectItem>
            <SelectItem value="PAID">Pago</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn("payment_type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => table.getColumn("payment_type")?.setFilterValue(value)}
        >
          <SelectTrigger className="ml-4 w-[180px]">
            <SelectValue placeholder="Filtrar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PIX">PIX</SelectItem>
            <SelectItem value="TED">TED</SelectItem>
            <SelectItem value="BOLETO">Boleto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="w-[200px]">
                      {header.isPlaceholder
                        ? null
                        : (
                          <div
                            {...{
                              className: "flex cursor-pointer select-none items-center justify-between",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {
                              {
                                asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                desc: <ArrowDown className="ml-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string]
                            }
                          </div>
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const handleOpenDialog = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setRejectionReason("");
    setSelectedPaymentId(null);
  };

  const handleRejectPayment = async () => {
    if (!selectedPaymentId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ status: PaymentStatus.REJECTED, rejection_reason: rejectionReason })
        .eq('id', selectedPaymentId);

      if (error) {
        throw new Error(error.message);
      }

      setPayments(payments.map(payment =>
        payment.id === selectedPaymentId ? { ...payment, status: PaymentStatus.REJECTED } : payment
      ));

      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      handleCloseDialog();
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const paymentId = row.getValue("id")
        return (
          <div className="flex items-center">
            {paymentId}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(paymentId);
                toast({ description: "ID copiado para a área de transferência." })
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "client_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cliente
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "payment_type",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, id, value) => {
        return value ? row.getValue<string>(id).includes(value) : true;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data de Criação
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as PaymentStatus;
        let badgeColor = "bg-gray-100 text-gray-800";
        
        switch (status) {
          case PaymentStatus.PENDING:
            badgeColor = "bg-yellow-100 text-yellow-800";
            break;
          case PaymentStatus.APPROVED:
            badgeColor = "bg-green-100 text-green-800";
            break;
          case PaymentStatus.REJECTED:
            badgeColor = "bg-red-100 text-red-800";
            break;
          case PaymentStatus.PAID:
            badgeColor = "bg-blue-100 text-blue-800";
            break;
          default:
            badgeColor = "bg-gray-100 text-gray-800";
            break;
        }
        
        return <Badge className={badgeColor}>{status}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value ? row.getValue<string>(id).includes(value) : true;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={PATHS.ADMIN.PAYMENT_DETAILS(payment.id)}>
                Detalhes
              </a>
            </Button>
            {payment.status === PaymentStatus.PENDING && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Rejeitar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Rejeitar Pagamento</DialogTitle>
                    <DialogDescription>
                      Tem certeza de que deseja rejeitar este pagamento?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Informe o motivo da rejeição..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={handleRejectPayment}>
                      Rejeitar Pagamento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          id, 
          amount, 
          status, 
          created_at, 
          updated_at, 
          client_id,
          payment_type,
          client:client_id (business_name)
        `);

      if (error) {
        throw new Error(error.message);
      }

      const transformedData: Payment[] = data.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        status: item.status as PaymentStatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        client_id: item.client_id,
        client_name: item.client?.business_name || "Unknown Client",
        payment_type: item.payment_type || PaymentType.PIX,
        rejection_reason: item.rejection_reason || null,
        bank_info: item.bank_info,
        document_url: item.document_url,
      }));

      setPayments(transformedData);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie solicitações e histórico de pagamentos"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW || "#"}
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar dados
        </Button>
      </PageHeader>
      
      <PageWrapper>
        <DataTable columns={columns} data={payments} />
      </PageWrapper>
    </div>
  );
};

export default AdminPayments;
