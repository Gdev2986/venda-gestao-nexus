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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientStatus } from "@/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PATHS } from "@/routes/paths";

interface DataTableProps {
  columns: any[];
  data: Client[];
}

function DataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  // Simplified implementation since we removed @tanstack/react-table
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    let result = [...data];
    
    // Apply text filter
    if (filterValue) {
      result = result.filter(item => 
        item.business_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.email?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Client];
        const bValue = b[sortColumn as keyof Client];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredData(result);
  }, [data, filterValue, statusFilter, sortColumn, sortDirection]);

  const toggleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Get paginated data
  const paginatedData = filteredData.slice(
    page * pageSize, 
    (page + 1) * pageSize
  );

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar clientes..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="ml-4 w-[180px]">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="INACTIVE">Inativo</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="w-[200px]">
                  {column.header && typeof column.header === 'function' ? (
                    column.header({ column, toggleSort: () => toggleSort(column.accessorKey || column.id) })
                  ) : (
                    <div 
                      className="flex cursor-pointer select-none items-center justify-between"
                      onClick={() => toggleSort(column.accessorKey || column.id)}
                    >
                      {column.header}
                      {sortColumn === (column.accessorKey || column.id) && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="ml-2 h-4 w-4" /> : 
                          <ArrowDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id || column.accessorKey}>
                      {column.cell ? 
                        column.cell({ row: { original: row, getValue: () => row[column.accessorKey as keyof Client] } }) : 
                        row[column.accessorKey as keyof Client]
                      }
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
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => p + 1)}
          disabled={(page + 1) * pageSize >= filteredData.length}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleOpenDialog = (clientId: string) => {
    setSelectedClientId(clientId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNotes("");
    setSelectedClientId(null);
  };

  const handleDeactivateClient = async () => {
    if (!selectedClientId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: ClientStatus.INACTIVE, deactivation_notes: notes })
        .eq('id', selectedClientId);

      if (error) {
        throw new Error(error.message);
      }

      setClients(clients.map(client =>
        client.id === selectedClientId ? { ...client, status: ClientStatus.INACTIVE } : client
      ));

      toast({
        title: "Cliente desativado",
        description: "O cliente foi desativado com sucesso.",
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

  const columns = [
    {
      id: "id",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "id",
      cell: ({ row }: any) => {
        const clientId = row.getValue("id");
        return (
          <div className="flex items-center">
            {clientId}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(clientId);
                toast({ description: "ID copiado para a área de transferência." });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "business_name",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome da Empresa
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data de Criação
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("created_at"));
        return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: any) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: any) => {
        const status = row.getValue("status") as ClientStatus;
        let badgeColor = "bg-gray-100 text-gray-800";
        
        switch (status) {
          case ClientStatus.ACTIVE:
            badgeColor = "bg-green-100 text-green-800";
            break;
          case ClientStatus.INACTIVE:
            badgeColor = "bg-red-100 text-red-800";
            break;
          case ClientStatus.PENDING:
            badgeColor = "bg-yellow-100 text-yellow-800";
            break;
          default:
            badgeColor = "bg-gray-100 text-gray-800";
            break;
        }
        
        return <Badge className={badgeColor}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: (info: any) => {
        const client = info.row.original;
        if (!client) return null; // Handle undefined or null

        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={PATHS.ADMIN.CLIENT_DETAILS(client.id.toString())}>
                Ver detalhes
              </a>
            </Button>
            {client.status === ClientStatus.ACTIVE && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Desativar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Desativar Cliente</DialogTitle>
                    <DialogDescription>
                      Tem certeza de que deseja desativar este cliente?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Informe o motivo da desativação..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={handleDeactivateClient}>
                      Desativar Cliente
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
        .from('clients')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      setClients(data);
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
        title="Clientes" 
        description="Gerencie os clientes da plataforma"
        actionLabel="Novo Cliente"
        actionLink={PATHS.ADMIN.CLIENT_NEW}
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
        <DataTable columns={columns} data={clients} />
      </PageWrapper>
    </div>
  );
};

export default AdminClients;
