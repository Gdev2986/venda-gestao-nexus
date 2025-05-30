
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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, RefreshCw, EyeIcon, PenIcon, Trash2, DollarSign, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  fee_plan_name?: string;
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
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientWithExtendedInfo | null>(null);
  const [newBalance, setNewBalance] = useState("");
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

      // Buscar informações de planos de taxa por cliente
      const { data: feePlansData, error: feePlansError } = await supabase
        .from('client_fee_plans')
        .select(`
          client_id,
          fee_plan:fee_plans(name)
        `)
        .in('client_id', clientIds);

      if (feePlansError) throw feePlansError;

      // Contar máquinas por cliente
      const machinesCount = machinesData?.reduce((acc: Record<string, number>, machine) => {
        if (machine.client_id) {
          acc[machine.client_id] = (acc[machine.client_id] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      // Mapear planos de taxa por cliente
      const feePlansMap = feePlansData?.reduce((acc: Record<string, string>, plan) => {
        if (plan.client_id && plan.fee_plan) {
          acc[plan.client_id] = (plan.fee_plan as any).name;
        }
        return acc;
      }, {}) || {};

      // Combinar informações
      const extended = clients.map(client => ({
        ...client,
        machines_count: machinesCount[client.id] || 0,
        fee_plan_name: feePlansMap[client.id] || null,
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

  const handleUpdateBalance = async () => {
    if (!selectedClient) return;

    try {
      const balance = parseFloat(newBalance);
      if (isNaN(balance)) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Valor inválido para o saldo."
        });
        return;
      }

      const { error } = await supabase
        .from('clients')
        .update({ balance })
        .eq('id', selectedClient.id);

      if (error) throw error;

      toast({
        title: "Saldo atualizado",
        description: "O saldo do cliente foi atualizado com sucesso."
      });

      setIsBalanceDialogOpen(false);
      setSelectedClient(null);
      setNewBalance("");
      
      // Atualizar a lista
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o saldo."
      });
    }
  };

  const openBalanceDialog = (client: ClientWithExtendedInfo) => {
    setSelectedClient(client);
    setNewBalance(client.current_balance?.toString() || "0");
    setIsBalanceDialogOpen(true);
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
                <TableHead className="hidden lg:table-cell">Plano Taxa</TableHead>
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
                        {client.status === "active" && "Ativo"}
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
                      {client.fee_plan_name ? (
                        <Badge variant="secondary">
                          {client.fee_plan_name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sem plano</span>
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
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Saldo - {selectedClient?.business_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="balance" className="block text-sm font-medium mb-2">
                Novo Saldo (R$)
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBalanceDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateBalance}>
                Atualizar Saldo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientsTable;
