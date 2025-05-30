
import { useState, useEffect } from "react";
import { Client } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, EyeIcon, PenIcon, Trash2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BalanceUpdateDialog } from "./BalanceUpdateDialog";

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onRefresh?: () => void;
}

interface ClientWithExtendedInfo extends Client {
  machines_count?: number;
  tax_block_name?: string;
  current_balance?: number;
}

const ClientsTable = ({
  clients,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRefresh,
}: ClientsTableProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [extendedClients, setExtendedClients] = useState<ClientWithExtendedInfo[]>([]);
  const [selectedClientForBalance, setSelectedClientForBalance] = useState<ClientWithExtendedInfo | null>(null);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (clients.length > 0) {
      fetchExtendedClientInfo();
    }
  }, [clients]);

  const fetchExtendedClientInfo = async () => {
    try {
      const clientIds = clients.map(c => c.id);
      
      // Buscar informações de máquinas por cliente
      const { data: machinesData, error: machinesError } = await supabase
        .from('machines')
        .select('client_id')
        .in('client_id', clientIds);

      if (machinesError) throw machinesError;

      // Buscar informações de blocos de taxa por cliente
      const { data: taxBlocksData, error: taxBlocksError } = await supabase
        .from('client_tax_blocks')
        .select(`
          client_id,
          tax_blocks!inner(name)
        `)
        .in('client_id', clientIds);

      if (taxBlocksError) throw taxBlocksError;

      // Contar máquinas por cliente
      const machinesCount = machinesData?.reduce((acc: Record<string, number>, machine) => {
        if (machine.client_id) {
          acc[machine.client_id] = (acc[machine.client_id] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      // Mapear blocos de taxa por cliente
      const taxBlocksMap = taxBlocksData?.reduce((acc: Record<string, string>, block) => {
        if (block.client_id && block.tax_blocks) {
          acc[block.client_id] = (block.tax_blocks as any).name;
        }
        return acc;
      }, {}) || {};

      // Combinar informações
      const extended = clients.map(client => ({
        ...client,
        machines_count: machinesCount[client.id] || 0,
        tax_block_name: taxBlocksMap[client.id] || null,
        current_balance: client.balance || 0
      }));

      setExtendedClients(extended);
    } catch (error) {
      console.error('Error fetching extended client info:', error);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const openBalanceDialog = (client: ClientWithExtendedInfo) => {
    setSelectedClientForBalance(client);
    setIsBalanceDialogOpen(true);
  };

  const handleBalanceUpdateSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        {onRefresh && (
          <div className="flex justify-end p-2 bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Atualizar</span>
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-center">Máquinas</TableHead>
                <TableHead className="hidden lg:table-cell">Bloco Taxa</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin opacity-50" />
                      <span className="ml-2">Carregando clientes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : extendedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                extendedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.business_name || client.company_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.contact_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(client.status)}
                      >
                        {client.status === "ACTIVE" && "Ativo"}
                        {client.status === "active" && "Ativo"}
                        {client.status === "INACTIVE" && "Inativo"}
                        {client.status === "inactive" && "Inativo"}
                        {!client.status && "Desconhecido"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium">
                          {formatCurrency(client.current_balance || 0)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openBalanceDialog(client)}
                          title="Editar saldo"
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {client.machines_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {client.tax_block_name ? (
                        <Badge variant="secondary">
                          {client.tax_block_name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sem bloco</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(client)}
                          title="Visualizar"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(client)}
                          title="Editar"
                        >
                          <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(client)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog para editar saldo */}
      {selectedClientForBalance && (
        <BalanceUpdateDialog
          open={isBalanceDialogOpen}
          onOpenChange={setIsBalanceDialogOpen}
          client={selectedClientForBalance}
          onSuccess={handleBalanceUpdateSuccess}
        />
      )}
    </>
  );
};

export default ClientsTable;
