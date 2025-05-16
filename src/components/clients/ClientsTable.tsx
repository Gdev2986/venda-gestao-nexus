
import { useState } from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeIcon,
  PenIcon,
  Trash2,
  CreditCard,
  User
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BalanceUpdateDialog } from "./BalanceUpdateDialog";
import { cn } from "@/lib/utils";

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onRefresh?: () => void;
}

const ClientsTable = ({
  clients,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRefresh
}: ClientsTableProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);

  const handleBalanceUpdate = (client: Client) => {
    setSelectedClient(client);
    setIsBalanceDialogOpen(true);
  };

  const handleBalanceSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const formatBalance = (balance?: number) => {
    if (balance === undefined || balance === null) return "R$ 0,00";
    return `R$ ${balance.toFixed(2).replace('.', ',')}`;
  };

  return (
    <>
      <div className="rounded-md border max-w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4 px-2">
                  <User className="h-4 w-4" />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">Saldo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="px-2">
                      {client.user_id && (
                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full" title="Cliente possui conta de usuário">
                          <User className="h-3 w-3" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{client.business_name || "Nome não informado"}</TableCell>
                    <TableCell>{client.contact_name}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className={cn(
                        "font-medium",
                        (client.balance || 0) > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      )}>
                        {formatBalance(client.balance)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleBalanceUpdate(client)} 
                          title="Gerenciar Saldo"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onView(client)} title="Visualizar">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Editar">
                          <PenIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive/80"
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
      
      {selectedClient && (
        <BalanceUpdateDialog 
          open={isBalanceDialogOpen}
          onOpenChange={setIsBalanceDialogOpen}
          client={selectedClient}
          onSuccess={handleBalanceSuccess}
        />
      )}
    </>
  );
};

export default ClientsTable;
